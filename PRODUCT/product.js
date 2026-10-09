let originalProducts = [];
let currentProduct = null;
let currentSelectedSize = null;
let currentGalleryImages = [];
let currentGalleryIndex = 0;
let currentQuantity = 1;

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    loadHighlightVoucher();
    loadProductsData();
});

function loadProductsData() {
    const urlParams = new URLSearchParams(window.location.search);
    const colorParam = urlParams.get('color') || '';

    let jsonUrl = '../data/products_inside.json';
    if (colorParam.startsWith('CS')) jsonUrl = '../data/products_sock.json';
    else if (colorParam.startsWith('CT')) jsonUrl = '../data/products_tshirt.json';

    fetch(jsonUrl)
        .then(res => res.json())
        .then(data => {
            originalProducts = processRawProductsData(data);
            initProductPage();
            // KÍCH HOẠT LẠI BADGE GIỎ HÀNG VÀ VOUCHER TỪ CONFIG.JS
            if (typeof updateCartBadge === 'function') updateCartBadge();
        })
        .catch(err => {
            console.error("Lỗi tải dữ liệu sản phẩm:", err);
            document.getElementById('product-content-body').innerHTML = `<h3 class="text-center w-full col-span-full py-20 text-slate-500">Lỗi kết nối dữ liệu. Vui lòng tải lại trang.</h3>`;
        });
}

function processRawProductsData(data) {
    return (Array.isArray(data) ? data : []).map((item, index) => {
        let colors = [];
        try { colors = JSON.parse(item.colorsJSON || item.colors || "[]"); } catch (e) { if (Array.isArray(item.colors)) colors = item.colors; }
        colors = colors.map(c => ({ ...c, images: (c.images || []).map(img => String(img).replace(/^["']|["']$/g, '').trim()) }));

        let introImages = [];
        try { introImages = JSON.parse(item.introImages || "[]").map(img => String(img).replace(/^["']|["']$/g, '').trim()); } catch (e) { if (Array.isArray(item.introImages)) introImages = item.introImages; }

        let usageGuideText = [];
        try { usageGuideText = JSON.parse(item.usageGuideText || "[]"); } catch (e) { if (Array.isArray(item.usageGuideText)) usageGuideText = item.usageGuideText; }

        const rawPrice = item.price ?? item.PRICE ?? 0;
        const rawOrigPrice = item.originalPrice ?? item.originalprice ?? item.ORIGINALPRICE ?? item.original_price ?? 0;

        const cleanPrice = Number(String(rawPrice).replace(/[^0-9]/g, '')) || 0;
        const cleanOrigPrice = Number(String(rawOrigPrice).replace(/[^0-9]/g, '')) || 0;
        const rawId = item.id || item.ID || item.productId || `SP_${index}`;

        return { ...item, id: String(rawId).trim(), price: cleanPrice, originalPrice: cleanOrigPrice, colors: colors, introImages: introImages, usageGuideText: usageGuideText };
    });
}

let highlightVoucherObj = null;

function loadHighlightVoucher() {
    const jsonUrl = '../data/vouchers.json';
    const sheetUrl = 'https://script.google.com/macros/s/AKfycbxECsm7sqwkmmxcyt1Arw553FCOvjBaj8oqJxL-k6DLMUjklgyG736xCcV8SwRQd3nw/exec?sheet=VOUCHERS';

    return fetch(jsonUrl)
        .then(res => {
            if (!res.ok) throw new Error('Không tải được file JSON tĩnh');
            return res.json();
        })
        .then(data => processHighlightData(data))
        .catch(() => {
            return fetch(sheetUrl)
                .then(res => res.json())
                .then(data => processHighlightData(data))
                .catch(err => console.warn('Không thể tải voucher highlight:', err));
        });
}

function processHighlightData(data) {
    if (!Array.isArray(data)) return null;

    // Lọc dòng có is_highlight = true (giới hạn lấy 1 dòng)
    const item = data.find(v => {
        const val = v.is_highlight ?? v.IS_HIGHLIGHT ?? v.isHighlight;
        return String(val).trim().toLowerCase() === 'true' || val === 1 || val === true;
    });

    if (item) {
        highlightVoucherObj = {
            code: String(item.code || '').trim().toUpperCase(),
            title: String(item.title || item.code || ''),
            desc: String(item.desc || ''),
            minOrder: Number(String(item.minOrder || 0).replace(/[^0-9]/g, '')) || 0
        };

        // Render lại trang nếu thông tin sản phẩm đã sẵn sàng
        if (currentProduct && typeof renderProductContent === 'function') {
            const urlParams = new URLSearchParams(window.location.search);
            const colorParam = urlParams.get('color') || '';
            let colorIdx = 0;
            if (colorParam) {
                const numMatch = colorParam.match(/\d+/);
                if (numMatch) colorIdx = Math.max(0, parseInt(numMatch[0], 10) - 1);
            }
            renderProductContent(currentProduct, colorIdx);
        }
    }
    return highlightVoucherObj;
}

function initProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product');
    const colorParam = urlParams.get('color');

    if (!productParam) {
        window.location.href = '../index.html';
        return;
    }

    const productId = String(productParam).trim().toLowerCase();
    currentProduct = originalProducts.find(item => String(item.id).toLowerCase() === productId);

    if (currentProduct) {
        document.title = `${currentProduct.name} | INSIDE+`;
        document.getElementById('breadcrumb-product-name').innerText = currentProduct.name;
        document.getElementById('breadcrumb-category').innerText = currentProduct.category || "SẢN PHẨM";

        let colorIdx = 0;
        if (colorParam) {
            const numMatch = colorParam.match(/\d+/);
            if (numMatch) colorIdx = Math.max(0, parseInt(numMatch[0], 10) - 1);
            if (colorIdx >= currentProduct.colors.length) colorIdx = 0;
        }

        addProductToViewed(currentProduct);
        renderProductContent(currentProduct, colorIdx);
        renderRecentViewedSlider(currentProduct.id);
    } else {
        document.getElementById('product-content-body').innerHTML = `<h3 class="text-center w-full col-span-full py-20 text-slate-500">Sản phẩm không tồn tại hoặc đã bị xóa.</h3>`;
    }
}

function renderProductContent(p, colorIdx) {
    const activeColor = p.colors && p.colors[colorIdx] ? p.colors[colorIdx] : p.colors[0];
    const availableSizes = activeColor.sizes || [];
    currentGalleryImages = activeColor.images || [];
    const hasDiscount = p.originalPrice && Number(p.originalPrice) > Number(p.price);
    const discountPercent = hasDiscount ? Math.round((1 - Number(p.price) / Number(p.originalPrice)) * 100) : 0;

    if (!currentSelectedSize || !availableSizes.some(s => s.name === currentSelectedSize)) {
        const firstAvailable = availableSizes.find(s => !s.outOfStock);
        currentSelectedSize = firstAvailable ? firstAvailable.name : (availableSizes.length > 0 ? availableSizes[0].name : null);
    }

    const selectedSizeObj = availableSizes.find(s => s.name === currentSelectedSize);
    let stockBadgeHtml = '';
    let maxStock = 999;

    if (selectedSizeObj) {
        const isOutOfStock = selectedSizeObj.outOfStock || selectedSizeObj.stock === 0;
        maxStock = selectedSizeObj.stock !== undefined ? selectedSizeObj.stock : (isOutOfStock ? 0 : 50);

        if (currentQuantity > maxStock && maxStock > 0) stockBadgeHtml = `<span class="text-red-600 font-bold text-[11px] bg-red-50 px-2 py-0.5 rounded-sm">Còn ${maxStock} SP</span>`;
        else if (maxStock < 20 && maxStock > 0) stockBadgeHtml = `<span class="text-amber-600 font-bold text-[11px] bg-amber-50 px-2 py-0.5 rounded-sm">Sắp hết hàng</span>`;
    }

    const isSelectedSizeOutOfStock = selectedSizeObj ? (selectedSizeObj.outOfStock || selectedSizeObj.stock === 0) : false;
    const isAllSizesOutOfStock = availableSizes.length > 0 && availableSizes.every(s => (s.outOfStock || s.stock === 0));
    const showOutOfStockBtn = isSelectedSizeOutOfStock || isAllSizesOutOfStock;

    // HIỂN THỊ HTML HÌNH ẢNH
    const imagesHtml = `
    <div class="block sm:hidden -mx-4 -mt-2 sm:mx-0 sm:mt-0 mb-6">
        <div class="relative w-full aspect-[3/4] bg-slate-100 overflow-hidden mb-3" onclick="openGalleryModal(window.currentMobileImgIdx || 0)">
            <img id="mobile-main-img" src="${activeColor.images[0] || ''}" class="w-full h-full object-cover">
            <button onclick="event.stopPropagation(); openGalleryModal(window.currentMobileImgIdx || 0)" class="zoom-icon-btn !opacity-100 !scale-100"><i data-lucide="search" class="w-4 h-4 text-slate-800"></i></button>
        </div>
        <div class="flex gap-2.5 overflow-x-auto px-4 no-scrollbar">
            ${(activeColor.images || []).map((img, imgIdx) => `
                <button onclick="changeMobileMainImage('${img}',${imgIdx})" class="mobile-thumb-btn flex-none w-16 aspect-[3/4] bg-slate-100 overflow-hidden border-b-2 transition-all pb-0.5 ${imgIdx === 0 ? 'border-slate-900 opacity-100' : 'border-transparent opacity-50'}">
                    <img src="${img}" class="w-full h-full object-cover">
                </button>
            `).join('')}
        </div>
    </div>
    <div class="hidden sm:grid grid-cols-2 gap-4">
        ${(activeColor.images || []).map((img, imgIdx) => `
            <div class="product-detail-img-container aspect-[4/5] bg-slate-100 shadow-sm" onclick="openGalleryModal(${imgIdx})">
                <img src="${img}" class="w-full h-full object-cover">
                <button onclick="event.stopPropagation(); openGalleryModal(${imgIdx})" class="zoom-icon-btn"><i data-lucide="search" class="w-4 h-4 text-slate-800"></i></button>
            </div>
        `).join('')}
    </div>`;

    // HIỂN THỊ MÀU & SIZE
    const colorsHtml = (p.colors || []).map((c, cIdx) => {
        const cIsAllOutOfStock = c.sizes && c.sizes.length > 0 && c.sizes.every(s => Boolean(s.outOfStock) || s.stock === 0);
        const strikeClass = cIsAllOutOfStock ? 'color-out-of-stock' : '';
        const activeClass = cIdx === colorIdx ? 'ring-2 ring-slate-900 ring-offset-2' : '';
        return `<div class="color-btn-wrapper p-0.5"><button onclick="changeProductColor(${cIdx})" class="w-6 h-6 rounded-full border border-slate-300 transition-all relative ${strikeClass} ${activeClass}" style="background-color: ${c.hex};" title="${c.name}"></button></div>`;
    }).join('');

    const sizesHtml = availableSizes.map(s => {
        const isSelected = currentSelectedSize === s.name;
        const isOutOfStock = s.outOfStock || s.stock === 0;
        const btnStyle = isOutOfStock ? (isSelected ? 'bg-slate-100 text-slate-400 border-slate-900 ring-2 ring-slate-900' : 'bg-slate-100 text-slate-300 border-slate-200') : (isSelected ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-900');
        return `<button onclick="currentSelectedSize='${s.name}'; renderProductContent(currentProduct, ${colorIdx})" class="w-12 h-12 border text-sm font-black transition flex items-center justify-center ${btnStyle}">${s.name}</button>`;
    }).join('');

    // KHÔI PHỤC FULL NÚT MUA VÀ CHÍNH SÁCH
    const activeShopeeUrl = activeColor.shopeeUrl || "https://shopee.vn";
    const activeTiktokUrl = activeColor.tiktokUrl || "https://tiktok.com";

    const actionBtnHtml = showOutOfStockBtn ?
        '<button disabled class="w-full bg-[#e2e8f0] text-[#64748b] py-4 px-6 font-bold text-xs uppercase tracking-widest pointer-events-none cursor-not-allowed text-center">HẾT HÀNG!</button>' :
        `<div class="flex items-center gap-3">
            <div class="flex items-center border border-slate-300 bg-white px-3 py-2.5">
                <button onclick="changeQty(-1)" class="px-2 text-sm font-bold text-slate-700 hover:text-black">-</button>
                <span id="qty-input-val" class="px-3 text-sm font-bold text-slate-900">${currentQuantity}</span>
                <button onclick="changeQty(1)" class="px-2 text-sm font-bold text-slate-700 hover:text-black">+</button>
            </div>
            <button onclick="addToCart(${colorIdx})" class="flex-1 bg-slate-950 text-white py-3.5 px-6 font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition text-center">Thêm vào giỏ hàng</button>
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

    // Đọc thông tin voucher từ object
    const voucherTitle = highlightVoucherObj ? highlightVoucherObj.title : 'GIẢM 50.000đ';
    const voucherCode = highlightVoucherObj ? highlightVoucherObj.code : 'INSIDE2026';
    const voucherDesc = highlightVoucherObj
        ? (highlightVoucherObj.desc || (highlightVoucherObj.minOrder > 0 ? `Đơn hàng từ ${highlightVoucherObj.minOrder.toLocaleString('vi-VN')}đ` : 'Áp dụng cho mọi đơn hàng'))
        : 'Chương trình ưu đãi đặc biệt dành cho khách hàng mua sắm tại INSIDE+';

    // Ảnh mẫu thời trang
    const fashionImg = (highlightVoucherObj && highlightVoucherObj.urlImg)
        ? highlightVoucherObj.urlImg
        : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600';

    const highlightBannerHtml = highlightVoucherObj ? `
    <div class="w-full my-5 select-none pointer-events-none font-['Montserrat'] shadow-md overflow-hidden border border-slate-200">
        <div class="grid grid-cols-12 min-h-[160px] sm:min-h-[180px]">
            
            <!-- BÊN TRÁI: NỀN SÁNG CHỨA THÔNG TIN CHI TIẾT (ĐÃ CĂN GIỮA NỘI DUNG) -->
            <div class="col-span-7 sm:col-span-7 bg-[#f8f6f0] text-slate-900 p-4 sm:p-6 flex flex-col justify-center gap-2">
                <div>
                    <span class="text-[8px] sm:text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500 block">SPECIAL VOUCHER</span>
                    <h3 class="text-base sm:text-2xl font-black uppercase tracking-tight text-[#ea580c] leading-none mt-1">
                        ${voucherTitle}
                    </h3>
                </div>

                <div>
                    <span class="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#ea580c] block mb-0.5">INSIDE+ SPECIAL OFFER</span>
                    <p class="text-[8px] sm:text-[10px] text-slate-500 font-medium leading-tight line-clamp-2">
                        ${voucherDesc}
                    </p>
                </div>

                <div class="pt-1">
                    <div class="inline-block bg-[#1c2e24] text-white text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                        VOUCHER DISCOUNT
                    </div>
                </div>
            </div>

            <!-- BÊN PHẢI: NỀN TỐI VỚI VÒNG TRÒN HÌNH ẢNH TO HƠN & CĂN GIỮA -->
            <div class="col-span-5 sm:col-span-5 bg-[#1c2e24] text-white p-2.5 sm:p-3 flex flex-col justify-between items-center relative overflow-hidden">
                
                <!-- Vòng tròn ảnh to hơn (w-28 h-28 trên mobile / w-36 h-36 trên desktop) -->
                <div class="w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-white/20 shadow-inner my-auto relative shrink-0">
                    <img src="${fashionImg}" alt="Fashion Model" class="w-full h-full object-cover object-top">
                </div>

                <!-- Mã CODE góc dưới bên phải -->
                <div class="w-full text-right pt-0.5">
                    <span class="text-[8px] sm:text-[10px] font-mono font-bold tracking-widest text-emerald-200">
                        CODE : ${voucherCode}
                    </span>
                </div>

            </div>

        </div>
    </div>
` : '';

    // IN VÀO DOM
    const container = document.getElementById('product-content-body');
    if (container) {
        window.currentMobileImgIdx = 0;
        container.innerHTML = `
        <div class="lg:col-span-8 flex flex-col space-y-6">${imagesHtml}</div>
        <div class="lg:col-span-4 flex flex-col space-y-6 sticky top-28 h-fit">
            <div>
                <span class="text-[10px] font-black uppercase text-slate-400">${p.category || 'INSIDE+'}</span>
                <h2 class="text-2xl font-black uppercase text-slate-900 mt-1 mb-3">${p.name}</h2>
                <div class="flex items-center gap-2.5 flex-wrap">
                    <span class="text-2xl font-black text-slate-900">${p.price.toLocaleString('vi-VN')}đ</span>
                    ${hasDiscount ? `
                        <span class="text-xs sm:text-sm text-slate-400 line-through font-normal">${p.originalPrice.toLocaleString('vi-VN')}đ</span>
                        <span class="bg-[#f1f3f9] text-[#556b92] font-semibold text-[11px] px-1.5 py-0.5 rounded-xs">
                            -${discountPercent}%
                        </span>
                    ` : ''}
                </div>
            </div>
            
            <div class="space-y-2" id="size-selection-container">
                <span class="text-xs font-bold uppercase text-slate-700">MÀU: <span class="font-black">${(activeColor.name || '').toUpperCase()}</span></span>
                <div class="flex gap-2 items-center">${colorsHtml}</div>
            </div>
            
            <!-- KHU VỰC SIZE + NÚT HƯỚNG DẪN BÊN DƯỚI -->
            <div class="space-y-2.5">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold uppercase text-slate-700">KÍCH CỠ: <span class="font-black text-slate-900">${currentSelectedSize || ''}</span></span>
                    ${stockBadgeHtml}
                </div>
                <div class="flex gap-2 flex-wrap">${sizesHtml}</div>
                <div>
                    <button onclick="openSizeModal()" class="text-xs font-bold text-blue-800 underline hover:text-blue-900 transition">Hướng dẫn chọn size</button>
                </div>
            </div>

            <!-- NỔI BẬT VOUCHER HIGHLIGHT (CHỈ XEM) -->
            ${highlightBannerHtml}

            <div class="space-y-3 pt-2">${actionBtnHtml}</div>
            ${policyHtml}
            
            <div class="border-t border-slate-200 mt-6 pt-2">
                <button onclick="openInfoDrawer()" class="w-full py-4 flex items-center justify-between border-b border-slate-100 text-sm font-bold text-slate-900 hover:text-slate-600"><span>Thông tin sản phẩm</span><i data-lucide="chevron-right" class="w-5 h-5 text-slate-400"></i></button>
                <button onclick="openIntroDrawer()" class="w-full py-4 flex items-center justify-between border-b border-slate-100 text-sm font-bold text-slate-900 hover:text-slate-600"><span>Giới thiệu sản phẩm</span><i data-lucide="chevron-right" class="w-5 h-5 text-slate-400"></i></button>
            </div>
        </div>`;
        if (window.lucide) lucide.createIcons({ root: container });
    }
}


function changeProductColor(colorIdx) {
    renderProductContent(currentProduct, colorIdx);
    const prefix = currentProduct.category === 'sock' ? 'CS' : currentProduct.category === 'tshirt' ? 'CT' : 'CI';
    const newColorCode = prefix + String(colorIdx + 1).padStart(2, '0');
    const newUrl = `?product=${currentProduct.id.toUpperCase()}&color=${newColorCode}`;
    window.history.replaceState(null, '', newUrl);
}

function changeQty(delta) {
    currentQuantity = Math.max(1, currentQuantity + delta);
    document.getElementById('qty-input-val').innerText = currentQuantity;
}

function changeMobileMainImage(imgUrl, imgIdx) {
    const mainImg = document.getElementById('mobile-main-img');
    if (mainImg) {
        mainImg.src = imgUrl;
        window.currentMobileImgIdx = imgIdx;
    }
    const thumbs = document.querySelectorAll('.mobile-thumb-btn');
    thumbs.forEach((btn, idx) => {
        if (idx === imgIdx) { btn.classList.remove('border-transparent', 'opacity-50'); btn.classList.add('border-slate-900', 'opacity-100'); }
        else { btn.classList.remove('border-slate-900', 'opacity-100'); btn.classList.add('border-transparent', 'opacity-50'); }
    });
}

// KHÔI PHỤC CHỨC NĂNG THÊM GIỎ HÀNG
function addToCart(colorIdx) {
    const p = currentProduct;
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
        category: p.category || 'INSIDE',
        price: p.price,
        image: activeColor.images[0],
        colorName: activeColor.name,
        size: currentSelectedSize,
        quantity: currentQuantity,
        colorsData: p.colors
    };

    if (typeof cartItems !== 'undefined') {
        const existingIndex = cartItems.findIndex(i => i.productId === newItem.productId && i.colorName === newItem.colorName && i.size === newItem.size);
        if (existingIndex > -1) {
            cartItems[existingIndex].quantity += currentQuantity;
        } else {
            cartItems.push(newItem);
        }
    }

    if (typeof updateCartBadge === 'function') updateCartBadge();
    showAddedNotification(newItem);
}

function showAddedNotification(item) {
    const existingPopup = document.getElementById('added-toast-popup');
    if (existingPopup) existingPopup.remove();

    const toast = document.createElement('div');
    toast.id = 'added-toast-popup';
    toast.className = 'fixed top-24 right-6 z-[200] bg-white border border-slate-200 shadow-2xl p-4 w-80 animate-fade-in';
    toast.innerHTML = `
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span class="text-xs font-black uppercase text-slate-900 tracking-wider">Đã thêm vào giỏ hàng</span>
            <button onclick="document.getElementById('added-toast-popup').remove(); if(typeof updateCartBadge==='function') updateCartBadge();" class="text-slate-400 hover:text-slate-900"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <div class="flex gap-3 items-center mb-4">
            <img src="${item.image}" loading="lazy" class="w-14 h-16 object-cover bg-slate-100">
            <div>
                <h4 class="font-bold text-xs uppercase text-slate-900 line-clamp-1">${item.name}</h4>
                <p class="text-[11px] text-slate-500 mt-0.5">${item.colorName} | S: ${item.size} | SL: ${item.quantity}</p>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <button onclick="document.getElementById('added-toast-popup').remove(); if(typeof updateCartBadge==='function') updateCartBadge();" class="w-full bg-white border border-slate-300 text-slate-800 py-2.5 font-bold text-[11px] uppercase tracking-wider hover:border-slate-900 transition">Đóng</button>
            <button onclick="document.getElementById('added-toast-popup').remove(); if(typeof updateCartBadge==='function') updateCartBadge(); openCartModal();" class="w-full bg-slate-900 text-white py-2.5 font-bold text-[11px] uppercase tracking-wider hover:bg-slate-800 transition">Xem giỏ hàng</button>
        </div>
    `;
    document.body.appendChild(toast);
    if (window.lucide) lucide.createIcons({ root: toast });
}

function openGalleryModal(index) {
    if (!currentGalleryImages || currentGalleryImages.length === 0) return;
    currentGalleryIndex = index;
    updateGalleryModalView();
    document.getElementById('gallery-modal').classList.remove('hidden');
    if (window.lucide) lucide.createIcons({ root: document.getElementById('gallery-modal') });
}
function closeGalleryModal() { document.getElementById('gallery-modal').classList.add('hidden'); }
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

function openInfoDrawer() {
    const p = currentProduct;
    if (!p) return;
    const guides = (p.usageGuideText && p.usageGuideText.length > 0) ? p.usageGuideText : ["Giặt máy chế độ nhẹ, nhiệt độ thường.", "Không dùng hóa chất tẩy.", "Phơi trong bóng mát.", "Sấy khô ở nhiệt độ thấp."];
    const contentEl = document.getElementById('info-drawer-content');
    if (contentEl) {
        contentEl.innerHTML = `
        <div class="grid grid-cols-[70px_1fr] gap-x-4 gap-y-3 pb-4 border-b border-slate-100"><span class="font-bold">Mã SP</span><span>${p.id.toUpperCase()}</span><span class="font-bold">Chất liệu</span><span>${p.materialText || 'Premium Cotton'}</span></div>
        <div class="pt-4 space-y-3"><h4 class="font-bold text-sm">Mô tả sản phẩm</h4><p class="text-slate-600">${p.descriptionText || 'Sản phẩm INSIDE+ Concept.'}</p></div>
        <div class="pt-4 space-y-3"><h4 class="font-bold text-sm">Hướng dẫn sử dụng</h4><ul class="space-y-2 text-slate-600 list-disc pl-4">${guides.map(i => `<li>${i}</li>`).join('')}</ul></div>`;
    }
    document.getElementById('info-drawer').classList.remove('hidden');
    setTimeout(() => { document.getElementById('info-overlay').classList.remove('opacity-0'); document.getElementById('info-panel').classList.remove('translate-x-full'); }, 10);
}
function closeInfoDrawer() {
    document.getElementById('info-overlay').classList.add('opacity-0');
    document.getElementById('info-panel').classList.add('translate-x-full');
    setTimeout(() => { document.getElementById('info-drawer').classList.add('hidden'); }, 300);
}

function openIntroDrawer() {
    const p = currentProduct;
    if (!p) return;
    const imagesToDisplay = (p.introImages && p.introImages.length > 0) ? p.introImages : (p.colors && p.colors[0] ? p.colors[0].images : []);
    const contentEl = document.getElementById('intro-drawer-content');
    if (contentEl) { contentEl.innerHTML = imagesToDisplay.map((img, idx) => `<img src="${img}" class="w-full h-auto block object-cover px-3 ${idx === 0 ? 'pt-3' : ''}">`).join(''); }
    document.getElementById('intro-drawer').classList.remove('hidden');
    setTimeout(() => { document.getElementById('intro-overlay').classList.remove('opacity-0'); document.getElementById('intro-panel').classList.remove('translate-x-full'); }, 10);
}
function closeIntroDrawer() {
    document.getElementById('intro-overlay').classList.add('opacity-0');
    document.getElementById('intro-panel').classList.add('translate-x-full');
    setTimeout(() => { document.getElementById('intro-drawer').classList.add('hidden'); }, 300);
}

function openSizeModal() { document.getElementById('size-modal').classList.remove('hidden'); }
function closeSizeModal() { document.getElementById('size-modal').classList.add('hidden'); }

// LỊCH SỬ ĐÃ XEM
// 1. Xác định tiền tố màu dựa trên danh mục
function getColorPrefix(category) {
    const cleanCat = String(category || '').trim().toLowerCase();
    if (cleanCat === 'sock') return 'CS';
    if (cleanCat === 'tshirt') return 'CT';
    return 'CI';
}

function formatColorCode(colorIdx, category) {
    const prefix = getColorPrefix(category);
    const num = (typeof colorIdx === 'number' ? colorIdx : 0) + 1;
    return prefix + String(num).padStart(2, '0');
}

// 2. Lấy đường dẫn trang danh mục tương ứng
function getCategoryPageUrl(category) {
    const cleanCat = String(category || '').trim().toLowerCase();
    if (cleanCat === 'sock') return '../SOCK/sock.html';
    if (cleanCat === 'tshirt') return '../TSHIRT/tshirt.html';
    return '../INSIDE/inside.html';
}

// 3. Lưu sản phẩm vào lịch sử đã xem
function addProductToViewed(product) {
    let viewed = JSON.parse(localStorage.getItem('viewed_products') || '[]');
    viewed = viewed.filter(p => p.id !== product.id);
    viewed.unshift({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category || 'inside', // Lưu đúng danh mục
        pageUrl: getCategoryPageUrl(product.category),
        images: product.colors && product.colors[0] ? product.colors[0].images : [],
        colors: product.colors
    });
    if (viewed.length > 8) {
        viewed = viewed.slice(0, 8);
    }
    localStorage.setItem('viewed_products', JSON.stringify(viewed));
}

function checkColorOutOfStock(colorObj) {
    if (!colorObj) return false;
    // Kiểm tra c.outOfStock trực tiếp ở cấp màu
    if (Boolean(colorObj.outOfStock)) return true;

    // Kiểm tra danh sách kích cỡ thuộc màu
    if (Array.isArray(colorObj.sizes) && colorObj.sizes.length > 0) {
        return colorObj.sizes.every(s => Boolean(s.outOfStock) || s.stock === 0);
    }
    return false;
}

function navigateToProduct(productId, category, colorIdx = 0) {
    const cleanCat = String(category || '').trim().toLowerCase();
    const formattedProduct = formatProductCode(productId, cleanCat);
    const formattedColor = formatColorCode(colorIdx, cleanCat);

    // Gom chung URL điều hướng về trang Product duy nhất
    window.location.href = `../PRODUCT/product.html?product=${encodeURIComponent(formattedProduct)}&color=${encodeURIComponent(formattedColor)}`;
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
        const hasDiscount = p.originalPrice && p.originalPrice > p.price;
        const discountPercent = hasDiscount ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

        const colorsDots = (p.colors || []).map((c, cIdx) => {
            const isColorOutOfStock = checkColorOutOfStock(c);
            const strikeClass = isColorOutOfStock ? 'color-out-of-stock' : '';

            return `<button onclick="event.stopPropagation(); changeRecentThumbColor('${p.id}', ${cIdx})" class="w-5 h-5 relative rounded-full border border-slate-300 transition-all ${strikeClass}" style="background-color: ${c.hex};" title="${c.name}"></button>`;
        }).join('');

        return `<div class="flex-none w-[calc(50%-12px)] lg:w-[calc(25%-18px)] group cursor-pointer" onclick="navigateToProduct('${p.id}', '${p.category || 'sock'}', 0)">
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

function scrollRecentSlider(direction) {
    const container = document.getElementById('recent-viewed-slider');
    if (!container) return;
    const scrollAmount = container.clientWidth;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
}

function updateRecentSliderArrows() {
    const container = document.getElementById('recent-viewed-slider');
    const prevBtn = document.getElementById('viewed-slider-prev');
    const nextBtn = document.getElementById('viewed-slider-next');
    if (!container || !prevBtn || !nextBtn) return;

    const isScrollable = container.scrollWidth > container.clientWidth;
    if (!isScrollable) {
        prevBtn.disabled = true;
        prevBtn.className = "text-slate-300 cursor-not-allowed transition"; // Màu nhạt
        nextBtn.disabled = true;
        nextBtn.className = "text-slate-300 cursor-not-allowed transition"; // Màu nhạt
        return;
    }

    // Kiểm tra nút Lùi (prev)
    if (container.scrollLeft <= 5) {
        prevBtn.disabled = true;
        prevBtn.className = "text-slate-300 cursor-not-allowed transition"; // Màu nhạt khi không lùi được nữa
    } else {
        prevBtn.disabled = false;
        prevBtn.className = "text-slate-900 cursor-pointer transition hover:opacity-75"; // Màu đậm khi dùng được
    }

    // Kiểm tra nút Tiến (next)
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
        nextBtn.disabled = true;
        nextBtn.className = "text-slate-300 cursor-not-allowed transition"; // Màu nhạt khi hết ảnh để tiến
    } else {
        nextBtn.disabled = false;
        nextBtn.className = "text-slate-900 cursor-pointer transition hover:opacity-75"; // Màu đậm khi dùng được
    }
}

// 2. Các hàm Menu Mobile
function clearAllBoldActiveStates() {
    document.querySelectorAll('.btn-bold-active, .active-bold').forEach(el => el.classList.remove('btn-bold-active', 'active-bold'));
}
function handleMenuBtnClick(element) {
    clearAllBoldActiveStates();
    if (element) element.classList.add('btn-bold-active');
    toggleMobileNavDrawer();
}
function handleCloseDrawerBtnClick(element) {
    clearAllBoldActiveStates();
    if (element) element.classList.add('btn-bold-active');
    toggleMobileNavDrawer();
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

// 3. Các hàm Modal Tìm Kiếm
let savedScrollPositionY = 0;
function handleSearchBtnClick(element) {
    clearAllBoldActiveStates();
    if (element) element.classList.add('btn-bold-active');
    openSearchModal();
}
function handleCloseSearchBtnClick(element) {
    clearAllBoldActiveStates();
    if (element) element.classList.add('btn-bold-active');
    closeSearchModal();
}
function openSearchModal() {
    const searchModal = document.getElementById('search-modal');
    if (!searchModal) return;

    savedScrollPositionY = window.scrollY;
    searchModal.classList.remove('is-closing', 'hidden');
    searchModal.scrollTop = 0;

    document.body.classList.add('drawer-open');
    document.body.style.top = `-${savedScrollPositionY}px`;

    const input = document.getElementById('search-input');
    if (input) {
        input.value = '';
        handleSearchInput('');
        setTimeout(() => input.focus(), 250);
    }
    if (window.lucide) lucide.createIcons({ root: searchModal });
}
function closeSearchModal() {
    const searchModal = document.getElementById('search-modal');
    if (!searchModal || searchModal.classList.contains('hidden')) return;

    searchModal.classList.add('is-closing');
    setTimeout(() => {
        searchModal.classList.add('hidden');
        searchModal.classList.remove('is-closing');
        document.body.classList.remove('drawer-open');
        document.body.style.top = '';
        window.scrollTo(0, savedScrollPositionY);
        clearAllBoldActiveStates();
    }, 280);
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
        <div class="group cursor-pointer" onclick="window.location.href='product.html?product=${p.id.toUpperCase()}&color=CS01'">
            <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden border border-slate-100">
                <img src="${p.colors && p.colors[0] && p.colors[0].images ? p.colors[0].images[0] : ''}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                <span class="absolute top-2 left-2 bg-white/90 text-[9px] font-black uppercase text-slate-900 px-2 py-0.5">${p.category || ''}</span>
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
        const cIdx = p.currentColorIdx || 0;
        const prodCode = formatProductCode(p.id, p.category);
        const colorCode = formatColorCode(cIdx, p.category);
        const img1 = (p.images && p.images[0]) || '';

        // Xác định prefix để gọi đúng product.html từ bất kỳ cấp thư mục nào
        const isInSubFolder = window.location.pathname.includes('/PRODUCT/') || window.location.pathname.includes('/product/');
        const prefix = isInSubFolder ? '' : 'PRODUCT/';

        return `<div class="group cursor-pointer" onclick="window.location.href='${prefix}product.html?product=${encodeURIComponent(prodCode)}&color=${encodeURIComponent(colorCode)}'">
            <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden border border-slate-100">
                <img src="${img1}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                <span class="absolute top-2 left-2 bg-white/90 text-[9px] font-black uppercase text-slate-900 px-2 py-0.5">${p.category || ''}</span>
            </div>
        </div>`;
    }).join('');
    if (window.lucide) lucide.createIcons({ root: container });
}

function clearViewedProducts() {
    localStorage.removeItem('viewed_products');
    renderViewedProducts();
    renderRecentViewedSlider(currentProduct ? currentProduct.id : null);
}

// KHÔI PHỤC KEYDOWN (ESC ĐỂ THOÁT) VÀ TOUCH (VUỐT ĐỂ ĐÓNG)
document.addEventListener('keydown', function (e) {
    const galleryModal = document.getElementById('gallery-modal');
    const isGalleryOpen = galleryModal && !galleryModal.classList.contains('hidden');
    if (isGalleryOpen) {
        if (e.key === 'ArrowLeft') { prevGalleryImage(); return; }
        if (e.key === 'ArrowRight') { nextGalleryImage(); return; }
    }

    if (e.key === 'Escape' || e.key === 'Esc') {
        const quickAddModal = document.getElementById('quick-add-cart-modal');
        if (quickAddModal && !quickAddModal.classList.contains('hidden')) { if (typeof closeQuickAddToCartModal === 'function') closeQuickAddToCartModal(); return; }
        const quickEditDrawer = document.getElementById('quick-edit-drawer');
        if (quickEditDrawer && !quickEditDrawer.classList.contains('hidden')) { if (typeof closeQuickEditDrawer === 'function') closeQuickEditDrawer(); return; }
        const voucherDrawer = document.getElementById('voucher-drawer');
        if (voucherDrawer && !voucherDrawer.classList.contains('hidden')) { if (typeof closeVoucherDrawer === 'function') closeVoucherDrawer(); return; }
        const cartModal = document.getElementById('cart-modal');
        if (cartModal && !cartModal.classList.contains('hidden')) { if (typeof closeCartModal === 'function') closeCartModal(); return; }
        const infoDrawer = document.getElementById('info-drawer');
        if (infoDrawer && !infoDrawer.classList.contains('hidden')) { closeInfoDrawer(); return; }
        const introDrawer = document.getElementById('intro-drawer');
        if (introDrawer && !introDrawer.classList.contains('hidden')) { closeIntroDrawer(); return; }
        if (isGalleryOpen) { closeGalleryModal(); return; }
        const sizeModal = document.getElementById('size-modal');
        if (sizeModal && !sizeModal.classList.contains('hidden')) { closeSizeModal(); return; }
        const searchModal = document.getElementById('search-modal');
        if (searchModal && !searchModal.classList.contains('hidden')) { closeSearchModal(); return; }
    }
});

let touchStartX = 0;
let touchStartY = 0;
let isNativeNavigation = false;

document.addEventListener('touchstart', function (e) {
    const startX = e.touches[0].clientX;
    const windowWidth = window.innerWidth;
    if (startX < 35 || startX > (windowWidth - 35)) { isNativeNavigation = true; return; }
    isNativeNavigation = false;
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function (e) {
    if (isNativeNavigation) return;
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);

    const mobileNav = document.getElementById('mobile-nav-drawer');
    if (mobileNav && !mobileNav.classList.contains('hidden')) {
        if (deltaX < -50 && Math.abs(deltaX) > deltaY) {
            toggleMobileNavDrawer();
            clearAllBoldActiveStates();
            return;
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
}, { passive: true });