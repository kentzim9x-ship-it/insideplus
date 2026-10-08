let visualFilterCategories = [];
let activeVisualFilter = "ALL";
let originalProducts = [];
let currentFilteredProducts = [];
let currentSelectedSize = null;
let currentGalleryImages = [];
let currentGalleryIndex = 0;
let currentQuantity = 1;
let currentFilterETag = null;

// --- Cấu hình Phân trang / Infinite Scroll ---
let currentPage = 1;
const PAGE_SIZE = 12;
let isLoadingProducts = false;
let catalogIntersectionObserver = null;

const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbxECsm7sqwkmmxcyt1Arw553FCOvjBaj8oqJxL-k6DLMUjklgyG736xCcV8SwRQd3nw/exec?sheet=SOCK';

function parseJsonSafe(val, fallback) {
    if (typeof val !== 'string') return val || fallback;
    try {
        return JSON.parse(val);
    } catch (e) {
        return fallback;
    }
}

// URL API Google Apps Script dự phòng (Thay URL thực tế của bạn vào đây)
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxECsm7sqwkmmxcyt1Arw553FCOvjBaj8oqJxL-k6DLMUjklgyG736xCcV8SwRQd3nw/exec?sheet=CATEGORIES_SOCK";

function loadVisualFilterCategories() {
    const filterJsonUrl = '../data/categories_sock.json';
    const sheetName = 'CATEGORIES_SOCK';

    return fetch(filterJsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Không tìm thấy file JSON tĩnh trên GitHub, chuyển sang dùng Google Sheet');
            }
            currentFilterETag = response.headers.get('ETag') || response.headers.get('Last-Modified');
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                visualFilterCategories = data.map(item => {
                    const rawId = (item.id || item.ID || 'ALL').toString().trim().toUpperCase();
                    // Lấy cột 'type' trên Google Sheet làm nhãn hiển thị bên dưới ảnh
                    const rawTypeLabel = (item.type || item.TYPE || item.styleValue || item.stylevalue || '').toString().trim();

                    // Làm sạch URL ảnh
                    let rawImg = (item.image || item.IMAGE || item.img || '').toString().trim();
                    if (rawImg.startsWith('[') && rawImg.endsWith(']')) {
                        rawImg = rawImg.slice(1, -1).trim();
                    }

                    return {
                        id: rawId,                  // Ví dụ: 'ALL', 'BRIEF', 'TRUNK'
                        typeLabel: rawTypeLabel,    // Ví dụ: 'Tất cả', 'Quần lót Brief', 'Quần lót Trunk'
                        image: rawImg
                    };
                });

                if (typeof renderVisualFilterBar === 'function') {
                    renderVisualFilterBar();
                }
            }
            return visualFilterCategories;
        })
        .catch(error => {
            console.warn(error.message);

            return fetch(`${APPS_SCRIPT_URL}?sheet=${sheetName}`)
                .then(res => {
                    if (!res.ok) throw new Error('Không thể tải dữ liệu từ Google Sheet API');
                    return res.json();
                })
                .then(fallbackData => {
                    if (Array.isArray(fallbackData)) {
                        visualFilterCategories = fallbackData.map(item => {
                            const rawId = (item.id || item.ID || 'ALL').toString().trim().toUpperCase();
                            const rawTypeLabel = (item.type || item.TYPE || item.styleValue || item.stylevalue || '').toString().trim();

                            let rawImg = (item.image || item.IMAGE || item.img || '').toString().trim();
                            if (rawImg.startsWith('[') && rawImg.endsWith(']')) {
                                rawImg = rawImg.slice(1, -1).trim();
                            }

                            return {
                                id: rawId,
                                typeLabel: rawTypeLabel,
                                image: rawImg
                            };
                        });

                        if (typeof renderVisualFilterBar === 'function') {
                            renderVisualFilterBar();
                        }
                    }
                    return visualFilterCategories;
                })
                .catch(apiError => {
                    console.error('Lỗi nạp dữ liệu cả 2 nguồn (JSON tĩnh & Google Sheet):', apiError);
                });
        });
}

// Hàm kiểm tra ngầm xem GitHub Actions đã đẩy file JSON tĩnh mới lên chưa
function checkFilterUpdatesSilently(jsonUrl) {
    // Chỉ gửi HEAD request ngầm (siêu nhẹ, không tải lại nội dung file)
    fetch(jsonUrl, { method: 'HEAD', cache: 'no-cache' })
        .then(response => {
            if (!response.ok) return;

            const newETag = response.headers.get('ETag') || response.headers.get('Last-Modified');

            // So sánh ETag: Nếu khác ETag cũ -> GitHub Actions đã cập nhật JSON mới trên server!
            if (newETag && currentFilterETag && newETag !== currentFilterETag) {
                console.log('Phát hiện dữ liệu Filter mới từ Google Sheet. Đang cập nhật...');
                currentFilterETag = newETag;

                // Âm thầm tải file JSON mới về
                fetch(jsonUrl, { cache: 'no-cache' })
                    .then(res => res.json())
                    .then(newData => {
                        // So sánh dữ liệu thực tế: Nếu thực sự khác mảng hiện tại mới tiến hành render lại
                        if (JSON.stringify(visualFilterCategories) !== JSON.stringify(newData)) {
                            visualFilterCategories = newData;
                            if (typeof renderVisualFilterBar === 'function') {
                                renderVisualFilterBar();
                            }
                        }
                    });
            }
        })
        .catch(() => {
            // Lỗi mạng ngầm thì bỏ qua, hoàn toàn không làm giật lag giao diện người dùng
        });
}

function processRawProductsData(data) {
    return (Array.isArray(data) ? data : []).map((item, index) => {
        let colors = [];
        if (item.colorsJSON) {
            colors = parseJsonSafe(item.colorsJSON, []);
        } else if (item.colors) {
            colors = parseJsonSafe(item.colors, []);
        }

        colors = colors.map(c => ({
            ...c,
            images: (c.images || []).map(img => String(img).replace(/^["']|["']$/g, '').trim())
        }));

        let introImages = parseJsonSafe(item.introImages, []);
        introImages = introImages.map(img => String(img).replace(/^["']|["']$/g, '').trim());

        let usageGuideText = parseJsonSafe(item.usageGuideText, []);

        // Đọc giá trị linh hoạt từ các kiểu đặt tên trường giá trong JSON
        const rawPrice = item.price ?? item.PRICE ?? 0;
        const rawOrigPrice = item.originalPrice ?? item.originalprice ?? item.ORIGINALPRICE ?? item.original_price ?? 0;

        const cleanPrice = Number(String(rawPrice).replace(/[^0-9]/g, '')) || 0;
        const cleanOrigPrice = Number(String(rawOrigPrice).replace(/[^0-9]/g, '')) || 0;

        return {
            ...item,
            id: String(item.id || item.ID || item.productId || `SP_${index}`).trim(),
            price: cleanPrice,
            originalPrice: cleanOrigPrice,
            colors: colors,
            introImages: introImages,
            usageGuideText: usageGuideText
        };
    });
}

// Biến lưu thông tin phiên bản file JSON (dùng ETag hoặc Last-Modified)
let currentJsonETag = null;

function loadProductsData() {
    const jsonUrl = '../data/products_sock.json';

    return fetch(jsonUrl)
        .then(response => {
            if (!response.ok) throw new Error('Không thể tải file JSON tĩnh');

            // Lưu lại thông tin phiên bản file (ETag / Last-Modified) của lần load đầu
            currentJsonETag = response.headers.get('ETag') || response.headers.get('Last-Modified');

            return response.json();
        })
        .then(data => {
            originalProducts = processRawProductsData(data);
            currentFilteredProducts = [...originalProducts];

            // Render giao diện LẦN 1 TỨC THÌ (Hiển thị mượt 0.02s)
            renderVisualFilterBar();
            renderDynamicFilterOptions();
            renderCatalog(originalProducts);
            if (typeof updateCartBadge === 'function') updateCartBadge();
            checkAndOpenProductFromUrl();

            // Bắt đầu kích hoạt kiểm tra ngầm phiên bản JSON tĩnh trên GitHub
            checkStaticJsonUpdatesSilently(jsonUrl);

            return originalProducts;
        })
        .catch(error => {
            console.error('Lỗi tải dữ liệu sản phẩm SOCK:', error);
        });
}

// Hàm kiểm tra ngầm xem GitHub Actions đã đẩy file JSON tĩnh mới lên chưa
function checkStaticJsonUpdatesSilently(jsonUrl) {
    // Chỉ gửi HEAD request ngầm (rất nhẹ, không tải lại toàn bộ nội dung file)
    fetch(jsonUrl, { method: 'HEAD', cache: 'no-cache' })
        .then(response => {
            if (!response.ok) return;

            const newETag = response.headers.get('ETag') || response.headers.get('Last-Modified');

            // So sánh: Nếu có ETag và ETag mới KHÁC ETag cũ -> GitHub Actions đã cập nhật JSON mới!
            if (newETag && currentJsonETag && newETag !== currentJsonETag) {
                console.log('Phát hiện dữ liệu JSON tĩnh mới từ GitHub Actions. Đang âm thầm cập nhật...');
                currentJsonETag = newETag;

                // Tải file JSON mới và cập nhật lại giao diện
                fetch(jsonUrl, { cache: 'no-cache' })
                    .then(res => res.json())
                    .then(newData => {
                        const freshProducts = processRawProductsData(newData);

                        // Kiểm tra nếu nội dung sản phẩm thực sự thay đổi mới render lại
                        if (JSON.stringify(originalProducts) !== JSON.stringify(freshProducts)) {
                            originalProducts = freshProducts;
                            currentFilteredProducts = [...originalProducts];

                            // Cập nhật giao diện nhẹ nhàng
                            renderCatalog(originalProducts);
                        }
                    });
            }
        })
        .catch(err => {
            // Lỗi mạng ngầm thì bỏ qua, không ảnh hưởng trải nghiệm người dùng
        });
}

function changeQty(delta) {
    currentQuantity = Math.max(1, currentQuantity + delta);
    const qtyInput = document.getElementById('qty-input-val');
    if (qtyInput) qtyInput.innerText = currentQuantity;
}

function addToCart(productId, colorIdx) {
    const p = originalProducts.find(x => x.id === productId);
    if (!p) return;
    const activeColor = p.colors[colorIdx];

    if (!currentSelectedSize) {
        const sizeBox = document.getElementById('size-selection-container');
        if (sizeBox) {
            let errorTip = document.getElementById('size-error-tooltip');
            if (!errorTip) {
                errorTip = document.createElement('div');
                errorTip.id = 'size-error-tooltip';
                errorTip.className = 'absolute -top-10 left-0 bg-[#222] text-white text-[11px] font-bold px-3 py-1.5 shadow-lg tracking-wide z-20 flex items-center gap-1 animate-bounce';
                errorTip.innerHTML = `Vui lòng chọn kích cỡ`;
                sizeBox.style.position = 'relative';
                sizeBox.appendChild(errorTip);
                setTimeout(() => errorTip.remove(), 2500);
            }
        }
        return;
    }

    const newItem = {
        productId: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        image: activeColor.images[0],
        colorName: activeColor.name,
        size: currentSelectedSize,
        quantity: currentQuantity,
        colorsData: p.colors
    };

    const existingIndex = cartItems.findIndex(i => i.productId === newItem.productId && i.colorName === newItem.colorName && i.size === newItem.size);
    if (existingIndex > -1) {
        cartItems[existingIndex].quantity += currentQuantity;
    } else {
        cartItems.push(newItem);
    }

    updateCartBadge();
    showAddedNotification(newItem);
}

function showAddedNotification(item) {
    const existingPopup = document.getElementById('added-toast-popup');
    if (existingPopup) existingPopup.remove();

    const codePrefix = formatProductCode(item.productId, item.category);
    const toast = document.createElement('div');
    toast.id = 'added-toast-popup';
    toast.className = 'fixed top-24 right-6 z-[200] bg-white border border-slate-200 shadow-2xl p-4 w-80 animate-fade-in';
    toast.innerHTML = `
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span class="text-xs font-black uppercase text-slate-900 tracking-wider">Đã thêm vào giỏ hàng</span>
            <button onclick="document.getElementById('added-toast-popup').remove(); updateCartBadge();" class="text-slate-400 hover:text-slate-900"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <div class="flex gap-3 items-center mb-4">
            <img src="${item.image}" loading="lazy" class="w-14 h-16 object-cover bg-slate-100">
            <div>
                <h4 class="font-bold text-xs uppercase text-slate-900 line-clamp-1">${item.name}</h4>
                <p class="text-[11px] text-slate-500 mt-0.5">${item.colorName} - ${codePrefix} | S: ${item.size} | SL: ${item.quantity}</p>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <button onclick="document.getElementById('added-toast-popup').remove(); updateCartBadge();" class="w-full bg-white border border-slate-300 text-slate-800 py-2.5 font-bold text-[11px] uppercase tracking-wider hover:border-slate-900 transition">Đóng</button>
            <button onclick="document.getElementById('added-toast-popup').remove(); updateCartBadge(); openCartModal();" class="w-full bg-slate-900 text-white py-2.5 font-bold text-[11px] uppercase tracking-wider hover:bg-slate-800 transition">Xem giỏ hàng</button>
        </div>
    `;
    document.body.appendChild(toast);
    if (window.lucide) lucide.createIcons({ root: toast });
}

function getCategoryPageUrl(category) {
    if (category === 'sock') return 'sock.html';
    if (category === 'tshirt') return '../TSHIRT/tshirt.html';
    return '../INSIDE/inside.html';
}

function getColorPrefix(category) {
    if (category === 'sock') return 'CS';
    if (category === 'tshirt') return 'CT';
    return 'CI';
}

function formatProductCode(productId, category) {
    return String(productId || '').toUpperCase();
}

function parseProductIdFromCode(code) {
    if (!code) return null;
    const cleanCode = String(code).trim().toLowerCase();
    const p = originalProducts.find(item => String(item.id).trim().toLowerCase() === cleanCode);
    return p ? p.id : null;
}

function formatColorCode(colorIdx, category) {
    const prefix = getColorPrefix(category);
    const num = (typeof colorIdx === 'number' ? colorIdx : 0) + 1;
    return prefix + String(num).padStart(2, '0');
}

function parseColorIndexFromCode(colorCode) {
    if (!colorCode) return 0;
    const numMatch = colorCode.match(/\d+/);
    if (!numMatch) return 0;
    return Math.max(0, parseInt(numMatch[0], 10) - 1);
}

function updateProductUrlParam(productId, colorIdx, isReplace = false) {
    if (productId) {
        const p = originalProducts.find(item => item.id === productId);
        const category = p ? p.category : 'inside';
        const formattedProduct = formatProductCode(productId, category);
        const formattedColor = formatColorCode(colorIdx, category);
        const newUrl = window.location.pathname + '?product=' + encodeURIComponent(formattedProduct) + '&color=' + encodeURIComponent(formattedColor);

        if (isReplace) {
            window.history.replaceState({ productId: productId, colorIdx: colorIdx }, '', newUrl);
        } else {
            window.history.pushState({ productId: productId, colorIdx: colorIdx }, '', newUrl);
        }
    } else {
        window.history.pushState({}, '', window.location.pathname);
    }
}

function checkAndOpenProductFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product');
    const colorParam = urlParams.get('color');

    if (productParam) {
        const productId = parseProductIdFromCode(productParam);
        if (productId) {
            const p = originalProducts.find(item => item.id === productId);
            if (p) {
                let colorIdx = parseColorIndexFromCode(colorParam);
                if (colorIdx < 0 || colorIdx >= (p.colors || []).length) colorIdx = 0;
                openProductDrawer(productId, colorIdx, false);
            }
        }
    } else {
        closeProductDrawer(false);
    }
}

function addProductToViewed(product) {
    let viewed = JSON.parse(localStorage.getItem('viewed_products') || '[]');
    viewed = viewed.filter(p => p.id !== product.id);
    viewed.unshift({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        pageUrl: getCategoryPageUrl(product.category),
        images: product.colors && product.colors[0] ? product.colors[0].images : [],
        colors: product.colors
    });
    if (viewed.length > 8) {
        viewed = viewed.slice(0, 8);
    }
    localStorage.setItem('viewed_products', JSON.stringify(viewed));
}

// HÀM TỰ ĐỘNG TỔNG HỢP VÀ RENDER TOÀN BỘ BỘ LỌC TỪ DỮ LIỆU SẢN PHẨM
function renderDynamicFilterOptions() {
    const styleContainer = document.getElementById('style-content');
    const sizeContainer = document.getElementById('size-content');
    const colorContainer = document.getElementById('color-content');

    if (!styleContainer || !sizeContainer || !colorContainer) return;

    // Sử dụng Set/Map để gom các giá trị duy nhất (không trùng lặp)
    const uniqueStyles = new Set();
    const uniqueSizes = new Set();
    const uniqueColorsMap = new Map(); // Key: hex (lowercase), Value: name

    // Duyệt qua toàn bộ sản phẩm đang có từ JSON
    originalProducts.forEach(product => {
        // 1. Gom kiểu dáng (Kiểu dáng được lưu ở trường product.style)
        if (product.style) {
            uniqueStyles.add(product.style);
        }

        // 2. Gom Màu sắc và Kích cỡ từ danh sách màu
        if (Array.isArray(product.colors)) {
            product.colors.forEach(colorObj => {
                if (colorObj.hex) {
                    const cleanHex = colorObj.hex.trim().toLowerCase();
                    if (!uniqueColorsMap.has(cleanHex)) {
                        uniqueColorsMap.set(cleanHex, colorObj.name || 'Màu sắc');
                    }
                }

                // Gom kích cỡ từ danh sách sizes của từng màu
                if (Array.isArray(colorObj.sizes)) {
                    colorObj.sizes.forEach(sizeObj => {
                        if (sizeObj.name) {
                            uniqueSizes.add(sizeObj.name.trim().toUpperCase());
                        }
                    });
                }
            });
        }
    });

    // --- 1. RENDER KIỂU DÁNG ---
    if (uniqueStyles.size > 0) {
        styleContainer.innerHTML = Array.from(uniqueStyles).map(style => `
            <label class="flex items-center text-xs font-bold text-slate-700 cursor-pointer">
                <input type="checkbox" onchange="onFilterChange()" name="filter-style" value="${style}" class="mr-2">
                ${style}
            </label>
        `).join('');
    } else {
        styleContainer.innerHTML = '<span class="text-xs text-slate-400">Không có kiểu dáng</span>';
    }

    // --- 2. RENDER KÍCH CỠ (Sắp xếp theo thứ tự chuẩn: S, M, L, XL, XXL,...) ---
    const standardSizeOrder = ['S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', 'FREE'];
    const sortedSizes = Array.from(uniqueSizes).sort((a, b) => {
        let idxA = standardSizeOrder.indexOf(a);
        let idxB = standardSizeOrder.indexOf(b);
        if (idxA === -1) idxA = 99;
        if (idxB === -1) idxB = 99;
        return idxA - idxB;
    });

    if (sortedSizes.length > 0) {
        sizeContainer.innerHTML = sortedSizes.map(size => `
            <button onclick="toggleSizeSelect(this)" data-val="${size}"
                class="filter-size-btn border border-slate-300 py-2 text-center text-xs font-bold hover:border-slate-900 transition">
                ${size}
            </button>
        `).join('');
    } else {
        sizeContainer.innerHTML = '<span class="text-xs text-slate-400 col-span-4">Không có kích cỡ</span>';
    }

    // --- 3. RENDER MÀU SẮC ---
    if (uniqueColorsMap.size > 0) {
        colorContainer.innerHTML = Array.from(uniqueColorsMap.entries()).map(([hex, name]) => `
            <button onclick="toggleColorSelect(this)" data-val="${hex}"
                class="filter-color-btn w-7 h-7 rounded-full border-2 border-slate-300 transition"
                style="background-color: ${hex};" title="${name}">
            </button>
        `).join('');
    } else {
        colorContainer.innerHTML = '<span class="text-xs text-slate-400">Không có màu sắc</span>';
    }
}

function renderRecentViewedSlider(currentProductId) {
    const viewed = JSON.parse(localStorage.getItem('viewed_products') || '[]');
    const container = document.getElementById('recent-viewed-slider');
    if (!container) return;

    const viewedFiltered = viewed.filter(p => p.id !== currentProductId);

    if (viewedFiltered.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 font-bold uppercase tracking-wider py-4">Chưa có sản phẩm nào khác đã xem.</p>';
        updateRecentSliderArrows();
        return;
    }

    container.innerHTML = viewedFiltered.map(p => {
        const img1 = (p.images && p.images[0]) || '';
        const img2 = (p.images && p.images[1]) || img1;
        const targetPage = getCategoryPageUrl(p.category);
        const isCurrentPage = targetPage.includes('inside.html');

        const clickAction = isCurrentPage
            ? `openProductDrawer('${p.id}', 0)`
            : `window.location.href='${targetPage}?product=${formatProductCode(p.id, p.category)}&color=${formatColorCode(0, p.category)}'`;

        // 1. Tính toán % giảm giá
        const hasDiscount = p.originalPrice && p.originalPrice > p.price;
        const discountPercent = hasDiscount ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

        const colorsDots = (p.colors || []).map((c, cIdx) => {
            // 2. Kiểm tra màu hết hàng
            const isColorOutOfStock = checkColorOutOfStock(c);
            const strikeClass = isColorOutOfStock ? 'color-out-of-stock' : '';

            // 3. Tăng kích thước nút màu (w-5 h-5) và thêm class relative
            return `<button onclick="event.stopPropagation(); changeRecentThumbColor('${p.id}', ${cIdx})" class="w-5 h-5 relative rounded-full border border-slate-300 transition-all ${strikeClass}" style="background-color: ${c.hex};" title="${c.name}"></button>`
        }).join('');

        return `<div class="flex-none w-[calc(50%-12px)] lg:w-[calc(25%-18px)] group cursor-pointer" onclick="${clickAction}">
            <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden mb-3">
                <img id="recent-thumb-${p.id}" src="${img1}" loading="lazy" data-img1="${img1}" data-img2="${img2}" 
                onmouseenter="this.src=this.getAttribute('data-img2'); this.classList.add('scale-105');" 
                onmouseleave="this.src=this.getAttribute('data-img1'); this.classList.remove('scale-105');" 
                class="w-full h-full object-cover transition-transform duration-500 ease-out">
            </div>
            
            <div class="flex items-center gap-2 mb-2 flex-wrap">${colorsDots}</div>
            
            <h4 class="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-tight line-clamp-1 mb-1">${p.name}</h4>
            
            <div class="flex items-center gap-2">
                <span class="text-xs sm:text-sm font-bold text-slate-900">${p.price.toLocaleString('vi-VN')}đ</span>
                ${hasDiscount ? `
                    <span class="text-[11px] text-slate-400 line-through font-normal">${p.originalPrice.toLocaleString('vi-VN')}đ</span>
                    <span class="bg-[#f1f3f9] text-[#556b92] font-semibold text-[11px] px-1.5 py-0.5 rounded-xs">-${discountPercent}%</span>
                ` : ''}
            </div>
        </div>`;
    }).join('');

    setTimeout(updateRecentSliderArrows, 50);
}

function changeRecentThumbColor(id, colorIdx) {
    const viewed = JSON.parse(localStorage.getItem('viewed_products') || '[]');
    const p = viewed.find(item => item.id === id) || originalProducts.find(item => item.id === id);
    if (!p) return;
    const targetColor = p.colors[colorIdx];
    const imgEl = document.getElementById('recent-thumb-' + id);
    if (imgEl && targetColor) {
        const newImg1 = targetColor.images[0];
        const newImg2 = targetColor.images[1] || newImg1;
        imgEl.src = newImg1;
        imgEl.setAttribute('data-img1', newImg1);
        imgEl.setAttribute('data-img2', newImg2);
    }
}

function scrollRecentSlider(direction) {
    const container = document.getElementById('recent-viewed-slider');
    if (!container) return;
    const scrollAmount = container.clientWidth;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    setTimeout(updateRecentSliderArrows, 350);
}

function updateRecentSliderArrows() {
    const container = document.getElementById('recent-viewed-slider');
    const prevBtn = document.getElementById('viewed-slider-prev');
    const nextBtn = document.getElementById('viewed-slider-next');
    if (!container || !prevBtn || !nextBtn) return;

    const isScrollable = container.scrollWidth > container.clientWidth;
    if (!isScrollable) {
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
    }
    prevBtn.disabled = container.scrollLeft <= 5;
    nextBtn.disabled = container.scrollLeft + container.clientWidth >= container.scrollWidth - 5;
}

function clearAllBoldActiveStates() {
    document.querySelectorAll('.btn-bold-active, .active-bold').forEach(el => el.classList.remove('btn-bold-active', 'active-bold'));
}

window.addEventListener('pageshow', clearAllBoldActiveStates);

window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        clearAllBoldActiveStates();
    }
});

window.addEventListener('popstate', function (e) {
    const infoDrawer = document.getElementById('info-drawer');
    if (infoDrawer && !infoDrawer.classList.contains('hidden')) closeInfoDrawer();

    const introDrawer = document.getElementById('intro-drawer');
    if (introDrawer && !introDrawer.classList.contains('hidden')) closeIntroDrawer();

    const galleryModal = document.getElementById('gallery-modal');
    if (galleryModal && !galleryModal.classList.contains('hidden')) closeGalleryModal();

    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product');

    requestAnimationFrame(() => {
        if (!productParam) {
            closeProductDrawer(false);
        } else {
            checkAndOpenProductFromUrl();
        }
    });
});

function handleMenuBtnClick(element) {
    clearAllBoldActiveStates();
    if (element) element.classList.add('btn-bold-active');
    toggleMobileNavDrawer();
}

function handleSearchBtnClick(element) {
    clearAllBoldActiveStates();
    if (element) element.classList.add('btn-bold-active');
    openSearchModal();
}

function handleCloseDrawerBtnClick(element) {
    clearAllBoldActiveStates();
    if (element) element.classList.add('btn-bold-active');
    toggleMobileNavDrawer();
}

function handleCloseSearchBtnClick(element) {
    clearAllBoldActiveStates();
    if (element) element.classList.add('btn-bold-active');
    closeSearchModal();
}

function handleDrawerNavItemClick(element) {
    clearAllBoldActiveStates();
    if (element) element.classList.add('btn-bold-active');
    toggleMobileNavDrawer();
}

function handleLogoClick(element) {
    clearAllBoldActiveStates();
    if (element) element.classList.add('btn-bold-active');
}

function toggleMobileNavDrawer() {
    const drawer = document.getElementById('mobile-nav-drawer');
    const panel = document.getElementById('mobile-nav-panel');

    if (drawer.classList.contains('hidden')) {
        drawer.classList.remove('hidden');
        setTimeout(() => panel.classList.remove('-translate-x-full'), 10);
    } else {
        panel.classList.add('-translate-x-full');
        setTimeout(() => {
            drawer.classList.add('hidden');
            clearAllBoldActiveStates();
        }, 300);
    }
}

function filterProductsByCategoryId(filterId) {
    const targetId = (filterId || 'ALL').toString().trim().toUpperCase();

    // 1. Trường hợp ID = "ALL": Hiển thị tất cả sản phẩm
    if (targetId === 'ALL') {
        currentFilteredProducts = [...originalProducts];
    } else {
        // 2. So sánh UPCASE(id) của filter với UPCASE(style) của sản phẩm
        currentFilteredProducts = originalProducts.filter(p => {
            const productStyle = (p.style || p.category || '').toString().trim().toUpperCase();
            return productStyle === targetId;
        });
    }

    // Render lại danh sách sản phẩm ra màn hình
    if (typeof renderCatalog === 'function') {
        renderCatalog(currentFilteredProducts);
    }
}

function renderVisualFilterBar() {
    const container = document.getElementById('visual-filter-grid');
    if (!container) return;

    container.innerHTML = visualFilterCategories.map(item => {
        // So sánh trạng thái active theo ID (đã chuẩn hóa hoa/thường)
        const isActive = (activeVisualFilter || 'ALL').toString().toUpperCase() === item.id;

        return `<div onclick="selectVisualFilter('${item.id}')" class="visual-filter-card group flex flex-col cursor-pointer ${isActive ? 'visual-card-active' : ''}">
            <div class="w-full aspect-[4/5] bg-slate-100 overflow-hidden relative">
                <img src="${item.image}" loading="lazy" alt="${item.typeLabel}" class="w-full h-full object-cover transition-transform duration-500">
            </div>
            <div class="pt-3.5 pb-1 text-left bg-white">
                <!-- Hiển thị cột type tiếng Việt bên dưới ảnh -->
                <h4 class="visual-card-title text-sm sm:text-base font-bold text-slate-900 tracking-tight transition-colors group-hover:text-black">${item.typeLabel}</h4>
            </div>
        </div>`;
    }).join('');

    setTimeout(checkFilterSliderArrows, 100);
}

function scrollFilterSlider(direction) {
    const container = document.getElementById('visual-filter-grid');
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    setTimeout(checkFilterSliderArrows, 350);
}

function checkFilterSliderArrows() {
    const container = document.getElementById('visual-filter-grid');
    const prevBtn = document.getElementById('slider-prev-btn');
    const nextBtn = document.getElementById('slider-next-btn');

    if (!container || !prevBtn || !nextBtn) return;

    if (window.innerWidth >= 1024) {
        const isScrollable = container.scrollWidth > container.clientWidth;
        if (isScrollable) {
            nextBtn.classList.toggle('hidden', container.scrollLeft + container.clientWidth >= container.scrollWidth - 5);
            prevBtn.classList.toggle('hidden', container.scrollLeft <= 5);
        } else {
            prevBtn.classList.add('hidden');
            nextBtn.classList.add('hidden');
        }
    } else {
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
    }
}

function selectVisualFilter(filterId) {
    // 1. Chuẩn hóa ID được chọn về dạng IN HOA (Ví dụ: 'ALL', 'BRIEF', 'TRUNK')
    const targetId = (filterId || 'ALL').toString().trim().toUpperCase();
    activeVisualFilter = targetId;

    // 2. Tìm danh mục tương ứng để lấy tiêu đề hiển thị
    const catObj = visualFilterCategories.find(c => c.id === targetId);

    const titleHeading = document.getElementById('page-category-title');
    if (titleHeading) {
        if (targetId === 'ALL') {
            titleHeading.innerText = 'SOCK (TẤT VỚ)';
        } else {
            // Lấy cột type hiển thị tên danh mục tiếng Việt lên tiêu đề
            titleHeading.innerText = catObj ? catObj.typeLabel : ('Tất Vớ ' + targetId);
        }
    }

    // 3. Reset các bộ lọc phụ khi chọn 'ALL'
    if (targetId === 'ALL') {
        document.querySelectorAll('#filter-panel input').forEach(el => el.checked = false);
        document.querySelectorAll('.filter-size-btn').forEach(btn => btn.classList.remove('border-slate-900', 'bg-slate-900', 'text-white', 'selected-size'));
        document.querySelectorAll('.filter-color-btn').forEach(btn => btn.classList.remove('ring-2', 'ring-slate-900', 'selected-color'));

        const btnApply = document.getElementById('btn-apply-filter');
        const btnClear = document.getElementById('btn-clear-filter');
        if (btnApply && btnClear) {
            btnApply.disabled = true;
            btnApply.className = "w-full bg-slate-300 text-white py-3 font-bold text-xs uppercase tracking-widest transition cursor-not-allowed";
            btnClear.disabled = true;
            btnClear.className = "w-full bg-white border border-slate-200 text-slate-400 py-3 font-bold text-xs uppercase tracking-widest transition cursor-not-allowed";
        }
        currentFilteredProducts = [...originalProducts];
    } else {
        // 4. Lọc sản phẩm: So sánh UPCASE(filterId) = UPCASE(p.style)
        currentFilteredProducts = originalProducts.filter(p => {
            const productStyle = (p.style || p.category || '').toString().trim().toUpperCase();
            return productStyle === targetId;
        });
    }

    renderVisualFilterBar();
    renderCatalog(currentFilteredProducts);
}

function renderProductCardHTML(p, cIdxActive = 0) {
    const firstColor = p.colors && p.colors[cIdxActive]
        ? p.colors[cIdxActive]
        : (p.colors && p.colors[0] ? p.colors[0] : { images: [''] });

    const img1 = firstColor.images[0] || '';
    const img2 = firstColor.images[1] || img1;

    const hasDiscount = p.originalPrice && p.originalPrice > p.price;
    const discountPercent = hasDiscount ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

    return `<div class="bg-white p-0 overflow-hidden group cursor-pointer transition" onclick="openProductDrawer('${p.id}', ${cIdxActive})">
        <div class="relative w-full aspect-[3/4] bg-slate-100 overflow-hidden mb-3">
            <img id="thumb-${p.id}" src="${img1}" loading="lazy" data-img1="${img1}" data-img2="${img2}" 
            onmouseenter="this.src=this.getAttribute('data-img2'); this.classList.add('scale-105');" 
            onmouseleave="this.src=this.getAttribute('data-img1'); this.classList.remove('scale-105');" 
            class="w-full h-full object-cover transition-transform duration-500 ease-out transform">
            
            <button onclick="event.stopPropagation(); if(typeof openQuickAddToCartModal==='function') openQuickAddToCartModal('${p.id}')" 
                    class="quick-add-btn-mobile sm:opacity-0 sm:group-hover:opacity-100 absolute bottom-1.5 right-1.5 w-8 h-8 rounded-full bg-white text-slate-800 flex items-center justify-center transition-all duration-200 shadow-md hover:bg-slate-100 z-10 border border-slate-200" 
                    title="Thêm nhanh vào giỏ">
                <svg class="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
            </button>
        </div>

        <!-- DANH SÁCH MÀU (Có p-1.5 py-1 giúp viền ring-offset tỏa ra không bị xén) -->
        <div class="flex items-center gap-2 px-1.5 py-1 mb-1 flex-wrap" onclick="event.stopPropagation()">
            ${(p.colors || []).map((c, cIdx) => {
        const isColorOutOfStock = (c.sizes && c.sizes.length > 0)
            ? c.sizes.every(s => Boolean(s.outOfStock) || s.stock === 0)
            : false;
        const activeStyle = cIdx === cIdxActive ? 'ring-2 ring-slate-900 ring-offset-2' : '';
        return `<button onclick="changeCatalogThumbColor('${p.id}',${cIdx})" 
        data-color-idx="${cIdx}"
        class="color-btn-${p.id} w-5 h-5 rounded-full border border-slate-300 transition-all ${activeStyle} ${isColorOutOfStock ? 'color-out-of-stock' : ''}" 
        style="background-color: ${c.hex};" title="${c.name}"></button>`;
    }).join('')}
        </div>

        <h3 class="font-bold text-slate-900 text-sm uppercase tracking-tight mb-1.5">${p.name}</h3>

        <!-- HIỂN THỊ GIÁ VÀ % NẰM CÙNG HÀNG THẲNG HÀNG -->
        <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-slate-900">${p.price.toLocaleString('vi-VN')}đ</span>
            ${hasDiscount ? `
                <span class="text-xs text-slate-400 line-through font-normal">${p.originalPrice.toLocaleString('vi-VN')}đ</span>
                <span class="bg-[#f1f3f9] text-[#556b92] font-semibold text-[11px] px-1.5 py-0.5 rounded-xs">
                    -${discountPercent}%
                </span>
            ` : ''}
        </div>
    </div>`;
}

function renderCatalog(items, isAppend = false) {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    document.querySelectorAll('.catalog-count-text').forEach(el => el.innerText = items.length + ' sản phẩm');

    if (items.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center text-xs text-slate-400 py-12 font-bold uppercase tracking-wider">Không tìm thấy sản phẩm phù hợp.</p>';
        return;
    }

    currentPage = 1;
    const initialItems = items.slice(0, PAGE_SIZE);

    // Đã đổi pagedItems thành initialItems
    const htmlContent = initialItems.map(p => {
        return renderProductCardHTML(p, 0);
    }).join('');

    // Đổ nội dung HTML đã render vào grid
    grid.innerHTML = htmlContent;

    let sentinel = document.getElementById('catalog-sentinel');
    if (!sentinel) {
        sentinel = document.createElement('div');
        sentinel.id = 'catalog-sentinel';
        sentinel.className = 'col-span-full h-10 flex items-center justify-center my-4';
        grid.after(sentinel);
    }
    sentinel.innerHTML = items.length > PAGE_SIZE ? '<span class="text-xs text-slate-400 font-bold uppercase tracking-wider">Đang tải thêm...</span>' : '';

    setupInfiniteScroll();

    if (window.lucide) lucide.createIcons();
}

function loadMoreProducts() {
    if (isLoadingProducts) return;
    const startIndex = currentPage * PAGE_SIZE;
    if (startIndex >= currentFilteredProducts.length) {
        const sentinel = document.getElementById('catalog-sentinel');
        if (sentinel) sentinel.innerHTML = '';
        return;
    }

    isLoadingProducts = true;
    const grid = document.getElementById('catalog-grid');
    const sentinel = document.getElementById('catalog-sentinel');
    if (sentinel) sentinel.innerHTML = '<span class="text-xs text-slate-400 font-bold uppercase tracking-wider">Đang tải thêm...</span>';

    setTimeout(() => {
        currentPage++;
        const newItems = currentFilteredProducts.slice(startIndex, currentPage * PAGE_SIZE);
        const tempDiv = document.createElement('div');
        // TRUYỀN THÊM THAM SỐ 0 CHO cIdxActive TẠI ĐÂY LÔ-GÍC TƯƠNG TỰ
        tempDiv.innerHTML = newItems.map(p => renderProductCardHTML(p, 0)).join('');

        while (tempDiv.firstChild) {
            grid.appendChild(tempDiv.firstChild);
        }

        if (currentPage * PAGE_SIZE >= currentFilteredProducts.length) {
            if (sentinel) sentinel.innerHTML = '';
        }

        if (window.lucide) lucide.createIcons();
        isLoadingProducts = false;
    }, 300);
}

function setupInfiniteScroll() {
    if (catalogIntersectionObserver) {
        catalogIntersectionObserver.disconnect();
    }

    const sentinel = document.getElementById('catalog-sentinel');
    if (!sentinel) return;

    catalogIntersectionObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadMoreProducts();
        }
    }, { rootMargin: '200px' });

    catalogIntersectionObserver.observe(sentinel);
}

function changeCatalogThumbColor(id, colorIdx) {
    const p = originalProducts.find(item => item.id === id);
    if (!p) return;

    const targetColor = p.colors[colorIdx];
    const imgEl = document.getElementById('thumb-' + id);

    // 1. Cập nhật ảnh tương ứng với màu được chọn
    if (imgEl && targetColor) {
        const newImg1 = targetColor.images[0] || '';
        const newImg2 = targetColor.images[1] || newImg1;
        imgEl.src = newImg1;
        imgEl.setAttribute('data-img1', newImg1);
        imgEl.setAttribute('data-img2', newImg2);
    }

    // 2. Cập nhật trạng thái vòng tròn viền đen active khi click đổi màu
    const colorButtons = document.querySelectorAll(`.color-btn-${id}`);
    colorButtons.forEach(btn => {
        const btnIdx = parseInt(btn.getAttribute('data-color-idx'), 10);
        if (btnIdx === colorIdx) {
            btn.classList.add('ring-2', 'ring-slate-900', 'ring-offset-2');
        } else {
            btn.classList.remove('ring-2', 'ring-slate-900', 'ring-offset-2');
        }
    });
}

function setSortOption(type) {
    const dropDesktop = document.getElementById('sort-dropdown-desktop');
    const dropMobile = document.getElementById('sort-dropdown-mobile');
    if (dropDesktop) dropDesktop.classList.add('hidden');
    if (dropMobile) dropMobile.classList.add('hidden');

    if (type === 'price-asc') currentFilteredProducts.sort((a, b) => a.price - b.price);
    else if (type === 'price-desc') currentFilteredProducts.sort((a, b) => b.price - a.price);
    else if (type === 'newest') currentFilteredProducts.sort((a, b) => b.id.localeCompare(a.id));
    renderCatalog(currentFilteredProducts);
}

function toggleSortDropdown(device) {
    const target = device === 'mobile' ? 'sort-dropdown-mobile' : 'sort-dropdown-desktop';
    const drop = document.getElementById(target);
    if (drop) drop.classList.toggle('hidden');
}

let savedCategoryScrollY = 0;

function openProductDrawer(id, colorIdx, shouldUpdateUrl) {
    const p = originalProducts.find(item => String(item.id).trim() === String(id).trim());
    if (!p) return;

    const drawer = document.getElementById('product-drawer');
    if (drawer && drawer.classList.contains('hidden')) {
        savedCategoryScrollY = window.scrollY || window.pageYOffset;
    }

    window.currentActiveProductId = p.id;
    const initialColorIdx = (typeof colorIdx === 'number') ? colorIdx : 0;
    currentSelectedSize = null;
    currentQuantity = 1;

    addProductToViewed(p);
    renderDrawerContent(p, initialColorIdx);
    renderRecentViewedSlider(p.id);

    const drawerHeaderContainer = document.getElementById('drawer-header-container');
    if (drawerHeaderContainer && drawerHeaderContainer.children.length === 0) {
        const headerElem = document.getElementById('main-header');
        if (headerElem) drawerHeaderContainer.innerHTML = headerElem.outerHTML;
    }

    const drawerFooterContainer = document.getElementById('drawer-footer-container');
    if (drawerFooterContainer && drawerFooterContainer.children.length === 0) {
        const footerElem = document.getElementById('main-footer');
        if (footerElem) drawerFooterContainer.innerHTML = footerElem.outerHTML;
    }

    if (drawer) {
        drawer.classList.remove('hidden');
        drawer.scrollTop = 0;
    }

    drawer.classList.add('is-active');
    document.body.classList.add('drawer-open');

    if (shouldUpdateUrl !== false) {
        updateProductUrlParam(p.id, initialColorIdx);
    }
}

function closeProductDrawer(shouldUpdateUrl) {
    const drawer = document.getElementById('product-drawer');
    if (drawer) {
        drawer.classList.add('hidden');
        drawer.scrollTop = 0;
        drawer.classList.remove('drawer-open');
    }

    document.body.classList.remove('drawer-open');

    window.scrollTo(0, savedCategoryScrollY);

    if (shouldUpdateUrl !== false) {
        updateProductUrlParam(null, null);
    }
}

function changeDrawerColor(productId, colorIdx) {
    const p = originalProducts.find(x => x.id === productId);
    if (!p) return;

    renderDrawerContent(p, colorIdx);
    updateProductUrlParam(p.id, colorIdx, true);

    const drawer = document.getElementById('product-drawer');
    if (drawer) {
        drawer.scrollTop = 0;
    }
}

function checkColorOutOfStock(colorObj) {
    if (!colorObj || !Array.isArray(colorObj.sizes) || colorObj.sizes.length === 0) return false;
    // Kiểm tra tất cả các size thuộc màu này có outOfStock = true hoặc stock = 0 không
    return colorObj.sizes.every(s => Boolean(s.outOfStock) || s.stock === 0);
}

function renderDrawerContent(p, colorIdx) {
    const activeColor = p.colors && p.colors[colorIdx] ? p.colors[colorIdx] : { name: '', hex: '', images: [''], sizes: [] };
    const availableSizes = activeColor.sizes || [];
    currentGalleryImages = activeColor.images || [];

    if (!currentSelectedSize || !availableSizes.some(s => s.name === currentSelectedSize)) {
        const firstAvailable = availableSizes.find(s => !s.outOfStock);
        if (firstAvailable) currentSelectedSize = firstAvailable.name;
        else if (availableSizes.length > 0) currentSelectedSize = availableSizes[0].name;
    }

    const selectedSizeObj = availableSizes.find(s => s.name === currentSelectedSize);

    // --- THÊM LOGIC TÍNH TOÁN BADGE TỒN KHO ---
    let stockBadgeHtml = '';
    let maxStock = 999;

    if (selectedSizeObj) {
        // Đánh giá hết hàng dựa trên thuộc tính outOfStock hoặc stock = 0
        const isOutOfStock = selectedSizeObj.outOfStock || selectedSizeObj.stock === 0;
        maxStock = selectedSizeObj.stock !== undefined ? selectedSizeObj.stock : (isOutOfStock ? 0 : 50);

        if (currentQuantity > maxStock && maxStock > 0) {
            stockBadgeHtml = `<span class="text-red-600 font-bold text-[11px] bg-red-50 px-2 py-0.5 rounded-sm">Còn ${maxStock} SP</span>`;
        } else if (maxStock < 20 && maxStock > 0) {
            stockBadgeHtml = `<span class="text-amber-600 font-bold text-[11px] bg-amber-50 px-2 py-0.5 rounded-sm">Sắp hết hàng</span>`;
        }
    }

    // Cập nhật lại điều kiện vô hiệu hóa nút bấm nếu stock = 0
    const isSelectedSizeOutOfStock = selectedSizeObj ? (selectedSizeObj.outOfStock || selectedSizeObj.stock === 0) : false;
    const isAllSizesOutOfStock = availableSizes.length > 0 && availableSizes.every(s => (s.outOfStock || s.stock === 0));
    const showOutOfStockBtn = isSelectedSizeOutOfStock || isAllSizesOutOfStock;

    const activeShopeeUrl = activeColor.shopeeUrl || "https://shopee.vn";
    const activeTiktokUrl = activeColor.tiktokUrl || "https://tiktok.com";

    const imagesHtml = `
    <div class="block sm:hidden -mx-4 -mt-2 sm:mx-0 sm:mt-0 mb-6">
        <div class="relative w-full aspect-[3/4] bg-slate-100 overflow-hidden mb-3" onclick="openGalleryModal(window.currentMobileImgIdx || 0)">
            <img id="mobile-main-img" src="${activeColor.images[0] || ''}" loading="lazy" class="w-full h-full object-cover">
            <button onclick="event.stopPropagation(); openGalleryModal(window.currentMobileImgIdx || 0)" class="zoom-icon-btn !opacity-100 !scale-100" title="Xem ảnh">
                <i data-lucide="search" class="w-4 h-4 text-slate-800"></i>
            </button>
        </div>

        <div class="flex gap-2.5 overflow-x-auto px-4 no-scrollbar">
            ${(activeColor.images || []).map((img, imgIdx) => `
                <button onclick="changeMobileMainImage('${img}',${imgIdx})" 
                    class="mobile-thumb-btn flex-none w-16 aspect-[3/4] bg-slate-100 overflow-hidden border-b-2 transition-all pb-0.5 ${imgIdx === 0 ? 'border-slate-900 opacity-100' : 'border-transparent opacity-50'}">
                    <img src="${img}" loading="lazy" class="w-full h-full object-cover">
                </button>
            `).join('')}
        </div>
    </div>

    <div class="hidden sm:grid grid-cols-2 gap-4">
        ${(activeColor.images || []).map((img, imgIdx) => `
            <div class="product-detail-img-container aspect-[4/5] bg-slate-100 shadow-sm" onclick="openGalleryModal(${imgIdx})">
                <img src="${img}" loading="lazy" class="w-full h-full object-cover">
                <button onclick="event.stopPropagation(); openGalleryModal(${imgIdx})" class="zoom-icon-btn" title="Xem ảnh">
                    <i data-lucide="search" class="w-4 h-4 text-slate-800"></i>
                </button>
            </div>
        `).join('')}
    </div>`;

    const colorsHtml = (p.colors || []).map((c, cIdx) => {
        const cIsAllOutOfStock = c.sizes && c.sizes.length > 0 && c.sizes.every(s => Boolean(s.outOfStock) || s.stock === 0);
        const strikeClass = cIsAllOutOfStock ? 'color-out-of-stock' : '';
        const activeClass = cIdx === colorIdx ? 'ring-2 ring-slate-900 ring-offset-2' : '';

        return `<div class="color-btn-wrapper p-0.5">
        <button onclick="changeDrawerColor('${p.id}', ${cIdx})" 
            class="w-6 h-6 rounded-full border border-slate-300 transition-all relative ${strikeClass} ${activeClass}" 
            style="background-color: ${c.hex};" title="${c.name}">
        </button>
    </div>`;
    }).join('');

    const sizesHtml = availableSizes.map(s => {
        const isSelected = currentSelectedSize === s.name;
        // Bổ sung kiểm tra s.stock === 0
        const isOutOfStock = s.outOfStock || s.stock === 0;

        const btnStyle = isOutOfStock
            ? (isSelected
                ? 'bg-slate-100 text-slate-400 border-slate-900 ring-2 ring-slate-900'
                : 'bg-slate-100 text-slate-300 border-slate-200')
            : (isSelected
                ? 'bg-slate-950 text-white border-slate-950'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-900');

        return `<button onclick="currentSelectedSize='${s.name}'; renderDrawerContent(originalProducts.find(x => x.id==='${p.id}'), ${colorIdx})" 
            class="w-12 h-12 border text-sm font-black transition flex items-center justify-center ${btnStyle}">${s.name}</button>`;
    }).join('');

    const actionBtnHtml = showOutOfStockBtn ?
        '<button disabled class="w-full bg-[#e2e8f0] text-[#64748b] py-4 px-6 font-bold text-xs uppercase tracking-widest pointer-events-none cursor-not-allowed text-center">HẾT HÀNG!</button>' :
        `<div class="flex items-center gap-3">
            <div class="flex items-center border border-slate-300 bg-white px-3 py-2.5">
                <button onclick="changeQty(-1)" class="px-2 text-sm font-bold text-slate-700 hover:text-black">-</button>
                <span id="qty-input-val" class="px-3 text-sm font-bold text-slate-900">${currentQuantity}</span>
                <button onclick="changeQty(1)" class="px-2 text-sm font-bold text-slate-700 hover:text-black">+</button>
            </div>
            <button onclick="addToCart('${p.id}', ${colorIdx})" class="flex-1 bg-slate-950 text-white py-3.5 px-6 font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition text-center">Thêm vào giỏ hàng</button>
        </div>
        <div class="space-y-2 pt-1">
            <a href="${activeShopeeUrl}" target="_blank" class="w-full bg-[#EE4D2D] text-white py-3.5 px-6 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition">MUA TRÊN SHOPEE MALL</a>
            <a href="${activeTiktokUrl}" target="_blank" class="w-full bg-slate-950 text-white py-3.5 px-6 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition">MUA TRÊN TIKTOK SHOP</a>
        </div>`;

    const policyHtml = `
    <div class="bg-slate-50 border border-slate-100 rounded-none p-4 my-6 space-y-3.5">
        <div class="flex items-center gap-3 text-xs font-semibold text-slate-800">
            <i data-lucide="truck" class="w-4 h-4 text-slate-700 shrink-0"></i>
            <span>Miễn phí vận chuyển đơn từ 399.000 đ.</span>
        </div>
        <div class="border-t border-slate-200/60 pt-3 flex items-center gap-3 text-xs font-semibold text-slate-800">
            <i data-lucide="rotate-ccw" class="w-4 h-4 text-slate-700 shrink-0"></i>
            <span>Miễn phí đổi trả trong 60 ngày</span>
        </div>
        <div class="border-t border-slate-200/60 pt-3 flex items-center gap-3 text-xs font-semibold text-slate-800">
            <i data-lucide="package-check" class="w-4 h-4 text-slate-700 shrink-0"></i>
            <span>Kiểm tra hàng trước khi thanh toán</span>
        </div>
    </div>`;

    const infoMenuHtml = `
    <div class="border-t border-slate-200 mt-6 pt-2">
        <button onclick="openInfoDrawer()" class="w-full py-4 flex items-center justify-between border-b border-slate-100 text-sm font-bold text-slate-900 hover:text-slate-600 transition">
            <span>Thông tin sản phẩm</span>
            <i data-lucide="chevron-right" class="w-5 h-5 text-slate-400"></i>
        </button>
        <button onclick="openIntroDrawer()" class="w-full py-4 flex items-center justify-between border-b border-slate-100 text-sm font-bold text-slate-900 hover:text-slate-600 transition">
            <span>Giới thiệu sản phẩm</span>
            <i data-lucide="chevron-right" class="w-5 h-5 text-slate-400"></i>
        </button>
    </div>`;

    const drawerBody = document.getElementById('drawer-content-body');
    if (drawerBody) {
        window.currentMobileImgIdx = 0;
        drawerBody.innerHTML = `
        <div class="lg:col-span-8 flex flex-col space-y-6">${imagesHtml}</div>
        <div class="lg:col-span-4 flex flex-col space-y-6 sticky top-28 h-fit">
            <div>
                <span class="text-[10px] font-black uppercase text-slate-400">INSIDE+</span>
                <h2 class="text-2xl font-black uppercase text-slate-900 mt-1">${p.name}</h2>
                <div class="flex items-center gap-3 mt-3">
                    <span class="text-2xl font-black text-slate-900">${p.price.toLocaleString('vi-VN')}đ</span>
                    ${(p.originalPrice && p.originalPrice > p.price) ? `
                        <span class="text-sm text-slate-400 line-through">${p.originalPrice.toLocaleString('vi-VN')}đ</span>
                        <span class="bg-slate-100 text-slate-600 font-bold text-xs px-2 py-0.5">
                            -${Math.round((1 - p.price / p.originalPrice) * 100)}%
                        </span>
                    ` : ''}
                </div>
            </div>
            <div class="space-y-2">
                <span class="text-xs font-bold uppercase text-slate-700">MÀU: <span class="font-black">${(activeColor.name || '').toUpperCase()}</span></span>
                <div class="flex gap-2 items-center">${colorsHtml}</div>
            </div>
            <div class="space-y-2" id="size-selection-container">
                <div class="flex justify-between items-center">
                    <!-- SỬA LẠI KHỐI NÀY ĐỂ HIỂN THỊ BADGE -->
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold uppercase text-slate-700">KÍCH CỠ: <span class="font-black text-slate-900">${currentSelectedSize || ''}</span></span>
                        ${stockBadgeHtml}
                    </div>
                    <button onclick="openSizeModal()" class="text-xs font-bold text-blue-600 hover:underline">Hướng dẫn chọn size</button>
                </div>
                <div class="flex gap-2 flex-wrap">${sizesHtml}</div>
            </div>
            <div class="space-y-3 pt-2">${actionBtnHtml}</div>
            ${policyHtml}
            ${infoMenuHtml}
        </div>`;

        if (window.lucide) lucide.createIcons({ root: drawerBody });
    }
}

function changeMobileMainImage(imgUrl, imgIdx) {
    const mainImg = document.getElementById('mobile-main-img');
    if (mainImg) {
        mainImg.src = imgUrl;
        window.currentMobileImgIdx = imgIdx;
    }
    const thumbs = document.querySelectorAll('.mobile-thumb-btn');
    thumbs.forEach((btn, idx) => {
        if (idx === imgIdx) {
            btn.classList.remove('border-transparent', 'opacity-50');
            btn.classList.add('border-slate-900', 'opacity-100');
        } else {
            btn.classList.remove('border-slate-900', 'opacity-100');
            btn.classList.add('border-transparent', 'opacity-50');
        }
    });
}

function openGalleryModal(index) {
    if (!currentGalleryImages || currentGalleryImages.length === 0) return;
    currentGalleryIndex = index;
    updateGalleryModalView();
    document.getElementById('gallery-modal').classList.remove('hidden');
    if (window.lucide) lucide.createIcons({ root: document.getElementById('gallery-modal') });
}

function closeGalleryModal() {
    document.getElementById('gallery-modal').classList.add('hidden');
}

function updateGalleryModalView() {
    const imgEl = document.getElementById('gallery-modal-img');
    const counterEl = document.getElementById('gallery-counter');
    if (imgEl) imgEl.src = currentGalleryImages[currentGalleryIndex];
    if (counterEl) counterEl.innerText = `${currentGalleryIndex + 1}/${currentGalleryImages.length}`;
}

function prevGalleryImage() {
    currentGalleryIndex = (currentGalleryIndex > 0) ? currentGalleryIndex - 1 : currentGalleryImages.length - 1;
    updateGalleryModalView();
}

function nextGalleryImage() {
    currentGalleryIndex = (currentGalleryIndex < currentGalleryImages.length - 1) ? currentGalleryIndex + 1 : 0;
    updateGalleryModalView();
}

function openFilterDrawer() {
    document.getElementById('filter-drawer').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('filter-overlay').classList.remove('opacity-0');
        document.getElementById('filter-panel').classList.remove('translate-x-full');
    }, 10);
}

function closeFilterDrawer() {
    document.getElementById('filter-overlay').classList.add('opacity-0');
    document.getElementById('filter-panel').classList.add('translate-x-full');
    setTimeout(() => document.getElementById('filter-drawer').classList.add('hidden'), 300);
}

function toggleFilterAccordion(id) { document.getElementById(id).classList.toggle('hidden'); }
function toggleSizeSelect(btn) { btn.classList.toggle('border-slate-900'); btn.classList.toggle('bg-slate-900'); btn.classList.toggle('text-white'); btn.classList.toggle('selected-size'); onFilterChange(); }
function toggleColorSelect(btn) { btn.classList.toggle('ring-2'); btn.classList.toggle('ring-slate-900'); btn.classList.toggle('selected-color'); onFilterChange(); }

function onFilterChange() {
    const btnApply = document.getElementById('btn-apply-filter');
    const btnClear = document.getElementById('btn-clear-filter');
    btnApply.disabled = false;
    btnApply.classList.remove('bg-slate-300', 'cursor-not-allowed');
    btnApply.classList.add('bg-slate-950');
    btnClear.disabled = false;
    btnClear.classList.remove('text-slate-400', 'cursor-not-allowed');
    btnClear.classList.add('text-slate-700', 'border-slate-900');
}

function applyFilters() {
    const selectedStyles = Array.from(document.querySelectorAll('input[name="filter-style"]:checked')).map(el => el.value);
    const selectedSizes = Array.from(document.querySelectorAll('.filter-size-btn.selected-size')).map(el => el.getAttribute('data-val'));
    const selectedColors = Array.from(document.querySelectorAll('.filter-color-btn.selected-color')).map(el => el.getAttribute('data-val'));

    currentFilteredProducts = originalProducts.filter(p => {
        let matchVisual = (activeVisualFilter === 'ALL' || p.style === activeVisualFilter);
        let matchStyle = selectedStyles.length === 0 || selectedStyles.includes(p.style);
        let matchSize = selectedSizes.length === 0 || (p.colors || []).some(c => c.sizes && c.sizes.some(s => selectedSizes.includes(s.name)));
        let matchColor = selectedColors.length === 0 || (p.colors || []).some(c => selectedColors.includes(c.hex));
        return matchVisual && matchStyle && matchSize && matchColor;
    });
    closeFilterDrawer();
    renderCatalog(currentFilteredProducts);
}

function clearFilters() {
    document.querySelectorAll('#filter-panel input').forEach(el => el.checked = false);
    document.querySelectorAll('.filter-size-btn').forEach(btn => btn.classList.remove('border-slate-900', 'bg-slate-900', 'text-white', 'selected-size'));
    document.querySelectorAll('.filter-color-btn').forEach(btn => btn.classList.remove('ring-2', 'ring-slate-900', 'selected-color'));
    selectVisualFilter('ALL');
}

let savedScrollPositionY = 0;

function openSearchModal() {
    const searchModal = document.getElementById('search-modal');
    if (!searchModal) return;

    savedScrollPositionY = window.scrollY;

    // Reset các trạng thái animation đóng cũ
    searchModal.classList.remove('is-closing', 'hidden');
    searchModal.scrollTop = 0;

    document.body.classList.add('drawer-open');
    document.body.style.top = `-${savedScrollPositionY}px`;

    const input = document.getElementById('search-input');
    if (input) {
        input.value = '';
        handleSearchInput('');
        // Tự động focus vào ô tìm kiếm sau khi hiệu ứng hoàn tất
        setTimeout(() => input.focus(), 250);
    }

    if (window.lucide) lucide.createIcons({ root: searchModal });
}

function closeSearchModal() {
    const searchModal = document.getElementById('search-modal');
    if (!searchModal || searchModal.classList.contains('hidden')) return;

    // Kích hoạt animation trượt ngược lên trên
    searchModal.classList.add('is-closing');

    // Chờ animation kéo lên hoàn tất (300ms) rồi mới ẩn modal
    setTimeout(() => {
        searchModal.classList.add('hidden');
        searchModal.classList.remove('is-closing');

        document.body.classList.remove('drawer-open');
        document.body.style.top = '';
        window.scrollTo(0, savedScrollPositionY);

        clearAllBoldActiveStates();
    }, 280);
}

function fillSearch(keyword) {
    const input = document.getElementById('search-input');
    input.value = keyword;
    handleSearchInput(keyword);
}

function clearViewedProducts() {
    localStorage.removeItem('viewed_products');
    renderViewedProducts();
    renderRecentViewedSlider(null);
}

function handleSearchInput(query) {
    const titleEl = document.getElementById('search-results-title');
    const clearBtn = document.getElementById('btn-clear-history');
    const container = document.getElementById('viewed-products-container');

    if (!query.trim()) {
        titleEl.innerHTML = '<i data-lucide="history" class="w-4 h-4 text-slate-400"></i> Sản phẩm đã xem';
        clearBtn.classList.remove('hidden');
        renderViewedProducts();
        return;
    }

    titleEl.innerHTML = '<i data-lucide="search" class="w-4 h-4 text-slate-400"></i> Kết quả tìm kiếm cho "' + query + '"';
    clearBtn.classList.add('hidden');

    const matches = originalProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    if (matches.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-xs text-slate-400 font-bold uppercase tracking-wider py-8">Không tìm thấy sản phẩm nào.</p>';
        return;
    }

    container.innerHTML = matches.map(p => `
        <div class="group cursor-pointer" onclick="openProductDrawer('${p.id}', 0); closeSearchModal();">
            <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden border border-slate-100">
                <img src="${p.colors && p.colors[0] && p.colors[0].images ? p.colors[0].images[0] : ''}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                <span class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-widest text-slate-900 px-2 py-0.5">${p.category}</span>
            </div>
        </div>
    `).join('');
    if (window.lucide) lucide.createIcons({ root: container });
}

function renderViewedProducts() {
    const viewed = JSON.parse(localStorage.getItem('viewed_products') || '[]');
    const container = document.getElementById('viewed-products-container');
    if (!container) return;

    if (viewed.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-xs text-slate-400 font-bold uppercase tracking-wider py-8">Bạn chưa xem sản phẩm nào gần đây.</p>';
        return;
    }

    container.innerHTML = viewed.map(p => {
        const targetPage = getCategoryPageUrl(p.category);
        const isCurrentPage = targetPage.includes('sock.html');

        const clickAction = isCurrentPage
            ? `openProductDrawer('${p.id}', 0); closeSearchModal();`
            : `window.location.href='${targetPage}?product=${formatProductCode(p.id, p.category)}&color=${formatColorCode(0, p.category)}'`;

        return `<div class="group cursor-pointer" onclick="${clickAction}">
            <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden border border-slate-100">
                <img src="${p.images ? p.images[0] : ''}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                <span class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-widest text-slate-900 px-2 py-0.5">${p.category}</span>
            </div>
        </div>`;
    }).join('');
    if (window.lucide) lucide.createIcons({ root: container });
}

function openSizeModal() {
    document.getElementById('size-modal').classList.remove('hidden');
    if (window.lucide) lucide.createIcons({ root: document.getElementById('size-modal') });
}
function closeSizeModal() { document.getElementById('size-modal').classList.add('hidden'); }

function toggleChatMenu() {
    const group = document.getElementById('social-links-group');
    const icon = document.getElementById('chat-icon');
    group.classList.toggle('hidden');
    icon.setAttribute('data-lucide', !group.classList.contains('hidden') ? 'x' : 'message-circle');
    if (window.lucide) lucide.createIcons({ root: document.getElementById('main-chat-btn') });
}

function scrollToTop() {
    const productDrawer = document.getElementById('product-drawer');
    if (productDrawer && !productDrawer.classList.contains('hidden')) {
        productDrawer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function openInfoDrawer() {
    const p = originalProducts.find(x => x.id === window.currentActiveProductId);
    if (!p) return;

    const guides = (p.usageGuideText && p.usageGuideText.length > 0) ? p.usageGuideText : [
        "Giặt máy ở chế độ nhẹ, nhiệt độ thường (30°C).",
        "Không sử dụng hóa chất tẩy có chứa clo.",
        "Phơi trong bóng mát.",
        "Sấy khô ở nhiệt độ thấp.",
        "Là ở nhiệt độ thấp (tối đa 110°C).",
        "Giặt với sản phẩm cùng màu.",
        "Không là lên chi tiết trang trí."
    ];

    const contentEl = document.getElementById('info-drawer-content');
    if (contentEl) {
        contentEl.innerHTML = `
        <div class="grid grid-cols-[70px_1fr] gap-x-4 gap-y-3 pb-4 border-b border-slate-100">
            <span class="font-bold text-slate-900">Mã SP</span>
            <span class="text-slate-600">${p.id ? p.id.toUpperCase() : ''}</span>
    
            <span class="font-bold text-slate-900">Chất liệu</span>
            <span class="text-slate-600">${p.materialText || ''}</span>
        </div>
        <div class="pt-4 space-y-3">
            <h4 class="font-bold text-slate-900 text-sm">Mô tả sản phẩm</h4>
            <p class="text-slate-600 leading-relaxed">${p.descriptionText || ''}</p>
        </div>
        <div class="pt-4 space-y-3">
            <h4 class="font-bold text-slate-900 text-sm">Hướng dẫn sử dụng</h4>
            <ul class="space-y-2 text-slate-600 list-disc pl-4">
                ${guides.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>`;
    }

    const drawer = document.getElementById('info-drawer');
    if (drawer) {
        drawer.classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('info-overlay').classList.remove('opacity-0');
            document.getElementById('info-panel').classList.remove('translate-x-full');
        }, 10);

        const productDrawer = document.getElementById('product-drawer');
        if (productDrawer) productDrawer.classList.add('drawer-open');

        if (window.lucide) lucide.createIcons({ root: drawer });
    }
}

function closeInfoDrawer() {
    const overlay = document.getElementById('info-overlay');
    const panel = document.getElementById('info-panel');
    const drawer = document.getElementById('info-drawer');

    if (overlay && panel && drawer) {
        overlay.classList.add('opacity-0');
        panel.classList.add('translate-x-full');
        setTimeout(() => {
            drawer.classList.add('hidden');
            const productDrawer = document.getElementById('product-drawer');
            if (productDrawer) productDrawer.classList.remove('drawer-open');
        }, 300);
    }
}

function openIntroDrawer() {
    const p = originalProducts.find(x => x.id === window.currentActiveProductId);
    if (!p) return;

    const imagesToDisplay = (p.introImages && p.introImages.length > 0)
        ? p.introImages
        : (p.colors && p.colors[0] ? p.colors[0].images : []);

    const contentEl = document.getElementById('intro-drawer-content');
    if (contentEl) {
        contentEl.innerHTML = imagesToDisplay.map((img, idx) => `
            <img src="${img}" loading="lazy" class="w-full h-auto block object-cover px-3 ${idx === 0 ? 'pt-3' : ''}">
        `).join('');
    }

    const drawer = document.getElementById('intro-drawer');
    if (drawer) {
        drawer.classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('intro-overlay').classList.remove('opacity-0');
            document.getElementById('intro-panel').classList.remove('translate-x-full');
        }, 10);

        const productDrawer = document.getElementById('product-drawer');
        if (productDrawer) productDrawer.classList.add('drawer-open');

        if (window.lucide) lucide.createIcons({ root: drawer });
    }
}

function closeIntroDrawer() {
    const overlay = document.getElementById('info-overlay');
    const panel = document.getElementById('intro-panel');
    const drawer = document.getElementById('intro-drawer');

    if (overlay && panel && drawer) {
        overlay.classList.add('opacity-0');
        panel.classList.add('translate-x-full');
        setTimeout(() => {
            drawer.classList.add('hidden');
            const productDrawer = document.getElementById('product-drawer');
            if (productDrawer) productDrawer.classList.remove('drawer-open');
        }, 300);
    }
}

window.addEventListener('resize', checkFilterSliderArrows);

document.addEventListener('keydown', function (e) {
    const galleryModal = document.getElementById('gallery-modal');
    const isGalleryOpen = galleryModal && !galleryModal.classList.contains('hidden');

    if (isGalleryOpen) {
        if (e.key === 'ArrowLeft') {
            prevGalleryImage();
            return;
        }
        if (e.key === 'ArrowRight') {
            nextGalleryImage();
            return;
        }
    }

    if (e.key === 'Escape' || e.key === 'Esc') {
        const quickAddModal = document.getElementById('quick-add-cart-modal');
        if (quickAddModal && !quickAddModal.classList.contains('hidden')) {
            if (typeof closeQuickAddToCartModal === 'function') closeQuickAddToCartModal();
            return;
        }

        const quickEditDrawer = document.getElementById('quick-edit-drawer');
        if (quickEditDrawer && !quickEditDrawer.classList.contains('hidden')) {
            if (typeof closeQuickEditDrawer === 'function') closeQuickEditDrawer();
            return;
        }

        const voucherDrawer = document.getElementById('voucher-drawer');
        if (voucherDrawer && !voucherDrawer.classList.contains('hidden')) {
            if (typeof closeVoucherDrawer === 'function') closeVoucherDrawer();
            return;
        }

        const cartModal = document.getElementById('cart-modal');
        if (cartModal && !cartModal.classList.contains('hidden')) {
            if (typeof closeCartModal === 'function') closeCartModal();
            return;
        }

        const infoDrawer = document.getElementById('info-drawer');
        if (infoDrawer && !infoDrawer.classList.contains('hidden')) {
            closeInfoDrawer();
            return;
        }

        const introDrawer = document.getElementById('intro-drawer');
        if (introDrawer && !introDrawer.classList.contains('hidden')) {
            closeIntroDrawer();
            return;
        }

        if (isGalleryOpen) {
            closeGalleryModal();
            return;
        }

        const sizeModal = document.getElementById('size-modal');
        if (sizeModal && !sizeModal.classList.contains('hidden')) {
            closeSizeModal();
            return;
        }

        const searchModal = document.getElementById('search-modal');
        if (searchModal && !searchModal.classList.contains('hidden')) {
            closeSearchModal();
            return;
        }

        const filterDrawer = document.getElementById('filter-drawer');
        if (filterDrawer && !filterDrawer.classList.contains('hidden')) {
            closeFilterDrawer();
            return;
        }

        const mobileNav = document.getElementById('mobile-nav-drawer');
        if (mobileNav && !mobileNav.classList.contains('hidden')) {
            toggleMobileNavDrawer();
            clearAllBoldActiveStates();
            return;
        }

        const productDrawer = document.getElementById('product-drawer');
        if (productDrawer && !productDrawer.classList.contains('hidden')) {
            closeProductDrawer(true);
            return;
        }

        const badgeModal = document.getElementById('voucher-badge-modal');
        if (badgeModal && !badgeModal.classList.contains('hidden')) {
            closeVoucherBadgeModal();
            return;
        }
    }
});

let touchStartX = 0;
let touchStartY = 0;
let isNativeNavigation = false;

document.addEventListener('touchstart', function (e) {
    const startX = e.touches[0].clientX;
    const windowWidth = window.innerWidth;

    if (startX < 35 || startX > (windowWidth - 35)) {
        isNativeNavigation = true;
        return;
    }

    isNativeNavigation = false;
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;

    const quickModal = document.getElementById('quick-add-cart-modal');
    if (quickModal && !quickModal.classList.contains('hidden')) {
        quickModalTouchStartY = e.touches[0].clientY;
    }
}, { passive: true });

document.addEventListener('touchend', function (e) {
    if (isNativeNavigation) return;

    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);

    const quickModal = document.getElementById('quick-add-cart-modal');
    if (quickModal && !quickModal.classList.contains('hidden')) {
        const currentTouchEndY = e.changedTouches[0].clientY;
        const swipeDownDistance = currentTouchEndY - quickModalTouchStartY;

        if (swipeDownDistance > 50) {
            if (typeof closeQuickAddToCartModal === 'function') {
                closeQuickAddToCartModal();
            }
            return;
        }
    }

    const mobileNav = document.getElementById('mobile-nav-drawer');
    if (mobileNav && !mobileNav.classList.contains('hidden')) {
        if (deltaX < -50 && Math.abs(deltaX) > deltaY) {
            toggleMobileNavDrawer();
            clearAllBoldActiveStates();
            return;
        }
    }

    if (deltaX > 60 && deltaX > deltaY) {
        const drawers = ['quick-edit-drawer', 'voucher-drawer', 'cart-modal', 'info-drawer', 'intro-drawer', 'search-modal'];
        for (let id of drawers) {
            const el = document.getElementById(id);
            if (el && !el.classList.contains('hidden')) {
                if (id === 'quick-edit-drawer' && typeof closeQuickEditDrawer === 'function') closeQuickEditDrawer();
                if (id === 'voucher-drawer' && typeof closeVoucherDrawer === 'function') closeVoucherDrawer();
                if (id === 'cart-modal' && typeof closeCartModal === 'function') closeCartModal();
                if (id === 'info-drawer') closeInfoDrawer();
                if (id === 'intro-drawer') closeIntroDrawer();
                if (id === 'search-modal') closeSearchModal();
                return;
            }
        }
    }

    const galleryModal = document.getElementById('gallery-modal');
    if (galleryModal && !galleryModal.classList.contains('hidden')) {
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > deltaY) {
            if (deltaX < 0) nextGalleryImage();
            else prevGalleryImage();
        }
        return;
    }
}, { passive: true });

document.addEventListener('DOMContentLoaded', function () {
    if (sessionStorage.getItem('auto_open_cart') === 'true') {
        sessionStorage.removeItem('auto_open_cart');
        openCartModal();

        const pendingQuickEditIdx = sessionStorage.getItem('auto_open_quick_edit');
        if (pendingQuickEditIdx !== null) {
            sessionStorage.removeItem('auto_open_quick_edit');
            const idx = parseInt(pendingQuickEditIdx, 10);
            setTimeout(() => {
                openQuickEdit(idx);
            }, 350);
        }
    }

    loadVisualFilterCategories()
    loadProductsData();
});