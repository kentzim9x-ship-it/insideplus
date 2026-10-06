const visualFilterCategories = [
    {
        id: "ALL",
        title: "Tất cả",
        styleValue: "ALL",
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "BRIEF",
        title: "Quần Lót Brief",
        styleValue: "Brief",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "TRUNK",
        title: "Quần Lót Trunk",
        styleValue: "Trunk",
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "BOXER_BRIEF",
        title: "Quần Lót Boxer Brief",
        styleValue: "Boxer Brief",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "BOXER",
        title: "Quần Lót Boxer",
        styleValue: "Boxer",
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "SEAMLESS",
        title: "Quần Lót Seamless",
        styleValue: "Seamless",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600"
    }
];

let activeVisualFilter = "ALL";

const originalProducts = [
    {
        id: "inside-1", name: "Quần Lót Nam Seamless Không Đường May Brief", category: "inside", price: 89000, originalPrice: 120000,
        style: "Brief",
        descriptionText: "Công nghệ Seamless ép nhiệt siêu mỏng không đường may, loại bỏ hoàn toàn vết hằn trên da khi mặc quần bó sát.",
        materialText: "92% Bamboo tự nhiên kết hợp 8% Spandex co giãn 4 chiều kháng khuẩn.",
        usageGuideText: [
            "Giặt máy ở chế độ nhẹ, nhiệt độ thường (30°C).",
            "Không sử dụng hóa chất tẩy có chứa clo.",
            "Phơi trong bóng mát.",
            "Sấy khô ở nhiệt độ thấp.",
            "Là ở nhiệt độ thấp (tối đa 110°C).",
            "Giặt với sản phẩm cùng màu.",
            "Không là lên chi tiết trang trí."
        ],
        introImages: [
            "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200"
        ],
        colors: [
            {
                name: "Đen", hex: "#000000",
                shopeeUrl: "https://shopee.vn/product/inside-1-den",
                tiktokUrl: "https://tiktok.com/product/inside-1-den",
                images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1200",
                    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200",
                    "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1200"],
                sizes: [
                    { name: "S", stock: 3, outOfStock: false },
                    { name: "M", stock: 0, outOfStock: true },
                    { name: "L", stock: 0, outOfStock: true }
                ]
            },
            {
                name: "Xám SA045", hex: "#6b7280",
                shopeeUrl: "https://shopee.vn/product/inside-1-xam",
                tiktokUrl: "https://tiktok.com/product/inside-1-xam",
                images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200"],
                sizes: [
                    { name: "S", stock: 0, outOfStock: true },
                    { name: "M", stock: 25, outOfStock: false },
                    { name: "L", stock: 14, outOfStock: false },
                    { name: "XL", stock: 0, outOfStock: true }
                ]
            }
        ]
    },
    {
        id: "inside-2", name: "Quần Lót Nam Sợi Tre Bamboo Premium Boxer", category: "inside", price: 115000, originalPrice: 150000,
        style: "Boxer",
        descriptionText: "Quần lót dáng đùi Boxer ôm nhẹ thoáng mát, cạp chun thêu tinh tế không gây hằn bụng.",
        materialText: "95% Bamboo Sợi Tre nhập khẩu, 5% Elastane thoáng khí chống nhăn.",
        usageGuideText: ["Giặt máy ở chế độ nhẹ, nhiệt độ thường (30°C)."],
        introImages: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1200"],
        colors: [
            {
                name: "Trắng", hex: "#ffffff",
                shopeeUrl: "https://shopee.vn/product/inside-2-trang",
                tiktokUrl: "https://tiktok.com/product/inside-2-trang",
                images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200"],
                sizes: [
                    { name: "S", stock: 0, outOfStock: true },
                    { name: "M", stock: 25, outOfStock: false },
                    { name: "L", stock: 14, outOfStock: false },
                    { name: "XL", stock: 0, outOfStock: true }
                ]
            }
        ]
    },
    {
        id: "inside-3", name: "Quần Lót Nam Modal Air Brief Siêu Nhẹ", category: "inside", price: 75000, originalPrice: 99000,
        style: "Brief",
        descriptionText: "Sợi Gỗ Sồi Modal siêu mềm mại.",
        materialText: "90% Modal Micro, 10% Spandex cao cấp.",
        usageGuideText: ["Giặt máy."],
        introImages: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1200"],
        colors: [
            {
                name: "Be", hex: "#e3c4a8",
                shopeeUrl: "https://shopee.vn/product/inside-3-be",
                tiktokUrl: "https://tiktok.com/product/inside-3-be",
                images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200"],
                sizes: [
                    { name: "S", stock: 0, outOfStock: true },
                    { name: "M", stock: 25, outOfStock: false },
                    { name: "L", stock: 14, outOfStock: false }
                ]
            }
        ]
    },
    {
        id: "inside-4", name: "Quần Lót Nam Thể Thao Pro-Dry Trunk Boxer", category: "inside", price: 135000, originalPrice: 180000,
        style: "Trunk",
        descriptionText: "Chuyên dụng vận động thể thao.",
        materialText: "88% Polyester, 12% Spandex.",
        usageGuideText: ["Giặt máy."],
        introImages: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1200"],
        colors: [
            {
                name: "Đen", hex: "#000000",
                shopeeUrl: "https://shopee.vn/product/inside-4-den",
                tiktokUrl: "https://tiktok.com/product/inside-4-den",
                images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200"],
                sizes: [
                    { name: "S", stock: 0, outOfStock: true },
                    { name: "M", stock: 25, outOfStock: false },
                    { name: "L", stock: 14, outOfStock: false },
                    { name: "XL", stock: 0, outOfStock: true }
                ]
            }
        ]
    }
];

let currentFilteredProducts = [...originalProducts];
let currentSelectedSize = null;
let currentGalleryImages = [];
let currentGalleryIndex = 0;
let currentQuantity = 1;

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

    const codePrefix = formatProductCode(item.productId, item.category);
    const toast = document.createElement('div');
    toast.id = 'added-toast-popup';
    toast.className = 'fixed top-24 right-6 z-[200] bg-white border border-slate-200 shadow-2xl p-4 w-80 animate-fade-in';
    toast.innerHTML = `
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span class="text-xs font-black uppercase text-slate-900 tracking-wider">Đã thêm vào giỏ hàng</span>
            <button onclick="document.getElementById('added-toast-popup').remove(); if(typeof updateCartBadge==='function') updateCartBadge();" class="text-slate-400 hover:text-slate-900"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <div class="flex gap-3 items-center mb-4">
            <img src="${item.image}" class="w-14 h-16 object-cover bg-slate-100">
            <div>
                <h4 class="font-bold text-xs uppercase text-slate-900 line-clamp-1">${item.name}</h4>
                <p class="text-[11px] text-slate-500 mt-0.5">${item.colorName} - ${codePrefix} | S: ${item.size} | SL: ${item.quantity}</p>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <button onclick="document.getElementById('added-toast-popup').remove(); if(typeof updateCartBadge==='function') updateCartBadge();" class="w-full bg-white border border-slate-300 text-slate-800 py-2.5 font-bold text-[11px] uppercase tracking-wider hover:border-slate-900 transition">Đóng</button>
            <button onclick="document.getElementById('added-toast-popup').remove(); if(typeof updateCartBadge==='function') updateCartBadge(); if(typeof openCartModal==='function') openCartModal();" class="w-full bg-slate-900 text-white py-2.5 font-bold text-[11px] uppercase tracking-wider hover:bg-slate-800 transition">Xem giỏ hàng</button>
        </div>
    `;
    document.body.appendChild(toast);
    if (window.lucide) lucide.createIcons({ root: toast });
}

function parseProductIdFromCode(code) {
    if (!code) return null;
    const numMatch = code.match(/\d+/);
    if (!numMatch) return null;
    const num = parseInt(numMatch[0], 10);
    const p = originalProducts.find(item => {
        const itemNumMatch = item.id.match(/\d+/);
        return itemNumMatch && parseInt(itemNumMatch[0], 10) === num;
    });
    return p ? p.id : null;
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
        
        // Nếu chuyển màu hoặc tham số phụ -> dùng replaceState để không rác lịch sử Back
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
                if (colorIdx < 0 || colorIdx >= p.colors.length) colorIdx = 0;
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
        images: product.colors[0].images,
        colors: product.colors
    });
    if (viewed.length > 8) {
        viewed = viewed.slice(0, 8);
    }
    localStorage.setItem('viewed_products', JSON.stringify(viewed));
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
        const img1 = p.images[0];
        const img2 = p.images[1] || img1;
        const targetPage = getCategoryPageUrl(p.category);
        const isCurrentPage = targetPage.includes('inside.html');

        const clickAction = isCurrentPage
            ? `openProductDrawer('${p.id}', 0)`
            : `window.location.href='${targetPage}?product=${formatProductCode(p.id, p.category)}&color=${formatColorCode(0, p.category)}'`;

        const colorsDots = (p.colors || []).map((c, cIdx) =>
            `<button onclick="event.stopPropagation(); changeRecentThumbColor('${p.id}', ${cIdx})" class="w-3.5 h-3.5 rounded-full border border-slate-300" style="background-color: ${c.hex};" title="${c.name}"></button>`
        ).join('');

        return `<div class="flex-none w-[calc(50%-12px)] lg:w-[calc(25%-18px)] group cursor-pointer" onclick="${clickAction}">
            <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden mb-3">
                <img id="recent-thumb-${p.id}" src="${img1}" data-img1="${img1}" data-img2="${img2}" 
                onmouseenter="this.src=this.getAttribute('data-img2'); this.classList.add('scale-105');" 
                onmouseleave="this.src=this.getAttribute('data-img1'); this.classList.remove('scale-105');" 
                class="w-full h-full object-cover transition-transform duration-500 ease-out">
            </div>
            <div class="flex items-center gap-1.5 mb-2">${colorsDots}</div>
            <h4 class="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-tight line-clamp-1 mb-1">${p.name}</h4>
            <div class="flex items-baseline gap-2">
                <span class="text-xs sm:text-sm font-medium text-slate-900">${p.price.toLocaleString('vi-VN')}đ</span>
                ${p.originalPrice ? `<span class="text-[11px] text-slate-400 line-through font-normal">${p.originalPrice.toLocaleString('vi-VN')}đ</span>` : ''}
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
    // Nếu trang được tải lại từ BFCache (vuốt back/forward)
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

    // Dùng requestAnimationFrame để đẩy việc xử lý DOM sang frame tiếp theo, giúp thao tác vuốt back phản hồi lập tức
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

function renderVisualFilterBar() {
    const container = document.getElementById('visual-filter-grid');
    if (!container) return;

    container.innerHTML = visualFilterCategories.map(item => {
        const isActive = activeVisualFilter === item.styleValue;
        return `<div onclick="selectVisualFilter('${item.styleValue}')" class="visual-filter-card group flex flex-col ${isActive ? 'visual-card-active' : ''}">
            <div class="w-full aspect-[4/5] bg-slate-100 overflow-hidden relative">
                <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500">
            </div>
            <div class="pt-3.5 pb-1 text-left bg-white">
                <h4 class="visual-card-title text-sm sm:text-base font-bold text-slate-900 tracking-tight transition-colors group-hover:text-black">${item.title}</h4>
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

function selectVisualFilter(styleVal) {
    activeVisualFilter = styleVal;

    const titleHeading = document.getElementById('page-category-title');
    if (titleHeading) {
        if (styleVal === 'ALL') {
            titleHeading.innerText = 'INSIDE (ĐỒ LÓT)';
        } else {
            const catObj = visualFilterCategories.find(c => c.styleValue === styleVal);
            titleHeading.innerText = catObj ? catObj.title : ('Quần Lót ' + styleVal);
        }
    }

    if (styleVal === 'ALL') {
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
        currentFilteredProducts = originalProducts.filter(p => p.style === styleVal);
    }

    renderVisualFilterBar();
    renderCatalog(currentFilteredProducts);
}

function renderCatalog(items) {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    document.querySelectorAll('.catalog-count-text').forEach(el => el.innerText = items.length + ' sản phẩm');

    if (items.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center text-xs text-slate-400 py-12 font-bold uppercase tracking-wider">Không tìm thấy sản phẩm phù hợp.</p>';
        return;
    }

    grid.innerHTML = items.map(p => {
        const firstColor = p.colors[0];
        const img1 = firstColor.images[0];
        const img2 = firstColor.images[1] || img1;

        return `<div class="bg-white p-0 overflow-hidden group cursor-pointer transition" onclick="openProductDrawer('${p.id}', 0)">
            <div class="relative w-full aspect-[3/4] bg-slate-100 overflow-hidden mb-3">
                <img id="thumb-${p.id}" src="${img1}" data-img1="${img1}" data-img2="${img2}" 
                onmouseenter="this.src=this.getAttribute('data-img2'); this.classList.add('scale-105');" 
                onmouseleave="this.src=this.getAttribute('data-img1'); this.classList.remove('scale-105');" 
                class="w-full h-full object-cover transition-transform duration-500 ease-out transform">
                
                <!-- NÚT GIỎ HÀNG: ĐẶT SÁT GÓC PHẢI DƯỚI (bottom-1.5 right-1.5) -->
                <button onclick="event.stopPropagation(); if(typeof openQuickAddToCartModal==='function') openQuickAddToCartModal('${p.id}')" 
                        class="quick-add-btn-mobile sm:opacity-0 sm:group-hover:opacity-100 absolute bottom-1.5 right-1.5 w-8 h-8 rounded-full bg-white text-slate-800 flex items-center justify-center transition-all duration-200 shadow-md hover:bg-slate-100 z-10 border border-slate-200" 
                        title="Thêm nhanh vào giỏ">
                    <svg class="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                </button>
            </div>
            <div class="flex items-center gap-1.5 mb-2" onclick="event.stopPropagation()">
                ${p.colors.map((c, cIdx) => {
            const isColorOutOfStock = c.sizes && c.sizes.length > 0 && c.sizes.every(s => s.outOfStock);
            return `<button onclick="changeCatalogThumbColor('${p.id}',${cIdx})" class="w-4 h-4 rounded-full border border-slate-300 ${isColorOutOfStock ? 'color-out-of-stock' : ''}" style="background-color: ${c.hex};" title="${c.name}"></button>`;
        }).join('')}
            </div>
            <h3 class="font-bold text-slate-900 text-sm uppercase tracking-tight mb-1.5">${p.name}</h3>
            <div class="flex items-baseline gap-2.5">
                <span class="text-sm font-medium text-slate-900">${p.price.toLocaleString('vi-VN')}đ</span>
                <span class="text-xs text-slate-400 line-through font-normal">${p.originalPrice ? p.originalPrice.toLocaleString('vi-VN') + 'đ' : ''}</span>
            </div>
        </div>`;
    }).join('');

    if (window.lucide) lucide.createIcons();
}

function changeCatalogThumbColor(id, colorIdx) {
    const p = originalProducts.find(item => item.id === id);
    if (!p) return;
    const targetColor = p.colors[colorIdx];
    const imgEl = document.getElementById('thumb-' + id);
    if (imgEl) {
        const newImg1 = targetColor.images[0];
        const newImg2 = targetColor.images[1] || newImg1;
        imgEl.src = newImg1;
        imgEl.setAttribute('data-img1', newImg1);
        imgEl.setAttribute('data-img2', newImg2);
    }
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

let savedCategoryScrollY = 0; // Biến lưu vị trí cuộn trang category

function openProductDrawer(id, colorIdx, shouldUpdateUrl) {
    const p = originalProducts.find(item => item.id === id);
    if (!p) return;

    // Luôn lưu vị trí cuộn màn hình hiện tại nếu drawer chưa mở
    const drawer = document.getElementById('product-drawer');
    if (drawer && drawer.classList.contains('hidden')) {
        savedCategoryScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
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
        drawer.scrollTop = 0; // Cuộn nội dung bên trong drawer lên đầu
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

    // Khôi phục lại đúng vị trí cuộn trang Category ban đầu
    window.scrollTo(0, savedCategoryScrollY);

    if (shouldUpdateUrl !== false) {
        updateProductUrlParam(null, null);
    }
}

function changeDrawerColor(productId, colorIdx) {
    const p = originalProducts.find(x => x.id === productId);
    if (!p) return;

    renderDrawerContent(p, colorIdx);
    // Đổi tham số thành true để dùng replaceState
    updateProductUrlParam(p.id, colorIdx, true); 

    const drawer = document.getElementById('product-drawer');
    if (drawer) {
        drawer.scrollTop = 0;
    }
}

function renderDrawerContent(p, colorIdx) {
    const activeColor = p.colors[colorIdx];
    const availableSizes = activeColor.sizes || [];
    currentGalleryImages = activeColor.images;

    if (!currentSelectedSize || !availableSizes.some(s => s.name === currentSelectedSize)) {
        const firstAvailable = availableSizes.find(s => !s.outOfStock);
        if (firstAvailable) currentSelectedSize = firstAvailable.name;
        else if (availableSizes.length > 0) currentSelectedSize = availableSizes[0].name;
    }

    const selectedSizeObj = availableSizes.find(s => s.name === currentSelectedSize);
    const isSelectedSizeOutOfStock = selectedSizeObj ? selectedSizeObj.outOfStock : false;
    const isAllSizesOutOfStock = availableSizes.length > 0 && availableSizes.every(s => s.outOfStock);
    const showOutOfStockBtn = isSelectedSizeOutOfStock || isAllSizesOutOfStock;

    const activeShopeeUrl = activeColor.shopeeUrl || "https://shopee.vn";
    const activeTiktokUrl = activeColor.tiktokUrl || "https://tiktok.com";

    const imagesHtml = `
    <div class="block sm:hidden -mx-4 -mt-2 sm:mx-0 sm:mt-0 mb-6">
        <div class="relative w-full aspect-[3/4] bg-slate-100 overflow-hidden mb-3" onclick="openGalleryModal(window.currentMobileImgIdx || 0)">
            <img id="mobile-main-img" src="${activeColor.images[0]}" class="w-full h-full object-cover">
            <button onclick="event.stopPropagation(); openGalleryModal(window.currentMobileImgIdx || 0)" class="zoom-icon-btn !opacity-100 !scale-100" title="Xem ảnh">
                <i data-lucide="search" class="w-4 h-4 text-slate-800"></i>
            </button>
        </div>

        <div class="flex gap-2.5 overflow-x-auto px-4 no-scrollbar">
            ${activeColor.images.map((img, imgIdx) => `
                <button onclick="changeMobileMainImage('${img}',${imgIdx})" 
                    class="mobile-thumb-btn flex-none w-16 aspect-[3/4] bg-slate-100 overflow-hidden border-b-2 transition-all pb-0.5 ${imgIdx === 0 ? 'border-slate-900 opacity-100' : 'border-transparent opacity-50'}">
                    <img src="${img}" class="w-full h-full object-cover">
                </button>
            `).join('')}
        </div>
    </div>

    <div class="hidden sm:grid grid-cols-2 gap-4">
        ${activeColor.images.map((img, imgIdx) => `
            <div class="product-detail-img-container aspect-[4/5] bg-slate-100 shadow-sm" onclick="openGalleryModal(${imgIdx})">
                <img src="${img}" class="w-full h-full object-cover">
                <button onclick="event.stopPropagation(); openGalleryModal(${imgIdx})" class="zoom-icon-btn" title="Xem ảnh">
                    <i data-lucide="search" class="w-4 h-4 text-slate-800"></i>
                </button>
            </div>
        `).join('')}
    </div>`;

    const colorsHtml = p.colors.map((c, cIdx) => {
        const cIsAllOutOfStock = c.sizes && c.sizes.length > 0 && c.sizes.every(s => s.outOfStock);
        const strikeClass = cIsAllOutOfStock ? 'color-out-of-stock' : '';
        const activeClass = cIdx === colorIdx ? 'ring-2 ring-slate-900 ring-offset-2' : '';

        return `<div class="color-btn-wrapper">
            <button onclick="changeDrawerColor('${p.id}', ${cIdx})" 
            class="w-7 h-7 rounded-full border border-slate-300 transition-all relative ${strikeClass} ${activeClass}" 
            style="background-color: ${c.hex};" title="${c.name}">
            </button>
        </div>`;
    }).join('');

    const sizesHtml = availableSizes.map(s => {
        const isSelected = currentSelectedSize === s.name;

        const btnStyle = s.outOfStock
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
                <div class="flex items-baseline gap-3 mt-3">
                    <span class="text-2xl font-black text-slate-900">${p.price.toLocaleString('vi-VN')}đ</span>
                    <span class="text-sm text-slate-400 line-through">${p.originalPrice ? p.originalPrice.toLocaleString('vi-VN') : Math.round(p.price * 1.2).toLocaleString('vi-VN')}đ</span>
                </div>
            </div>
            <div class="space-y-2">
                <span class="text-xs font-bold uppercase text-slate-700">MÀU: <span class="font-black">${activeColor.name.toUpperCase()}</span></span>
                <div class="flex gap-2 items-center">${colorsHtml}</div>
            </div>
            <div class="space-y-2" id="size-selection-container">
                <div class="flex justify-between items-center">
                    <span class="text-xs font-bold uppercase text-slate-700">KÍCH CỠ</span>
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
        let matchSize = selectedSizes.length === 0 || p.colors.some(c => c.sizes && c.sizes.some(s => selectedSizes.includes(s.name)));
        let matchColor = selectedColors.length === 0 || p.colors.some(c => selectedColors.includes(c.hex));
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

    searchModal.classList.remove('hidden');
    searchModal.scrollTop = 0;

    document.body.classList.add('drawer-open');
    document.body.style.top = `-${savedScrollPositionY}px`;

    const input = document.getElementById('search-input');
    if (input) {
        input.value = '';
        handleSearchInput('');
    }

    if (window.lucide) lucide.createIcons({ root: searchModal });
}

function closeSearchModal() {
    const searchModal = document.getElementById('search-modal');
    if (searchModal) {
        searchModal.classList.add('hidden');
    }

    document.body.classList.remove('drawer-open');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollPositionY);

    clearAllBoldActiveStates();
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
                <img src="${p.colors[0].images[0]}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
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
        const isCurrentPage = targetPage.includes('inside.html');

        const clickAction = isCurrentPage
            ? `openProductDrawer('${p.id}', 0); closeSearchModal();`
            : `window.location.href='${targetPage}?product=${formatProductCode(p.id, p.category)}&color=${formatColorCode(0, p.category)}'`;

        return `<div class="group cursor-pointer" onclick="${clickAction}">
            <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden border border-slate-100">
                <img src="${p.images[0]}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
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

    const guides = p.usageGuideText || [
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
            <span class="text-slate-600">${p.id.toUpperCase()}</span>
    
            <span class="font-bold text-slate-900">Chất liệu</span>
            <span class="text-slate-600">${p.materialText}</span>
        </div>
        <div class="pt-4 space-y-3">
            <h4 class="font-bold text-slate-900 text-sm">Mô tả sản phẩm</h4>
            <p class="text-slate-600 leading-relaxed">${p.descriptionText}</p>
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

    const imagesToDisplay = p.introImages || (p.colors[0] ? p.colors[0].images : []);

    const contentEl = document.getElementById('intro-drawer-content');
    if (contentEl) {
        contentEl.innerHTML = imagesToDisplay.map((img, idx) => `
            <img src="${img}" class="w-full h-auto block object-cover px-3 ${idx === 0 ? 'pt-3' : ''}">
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
    const overlay = document.getElementById('intro-overlay');
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
    }
});

// Biến lưu tọa độ thao tác vuốt
let touchStartX = 0;
let touchStartY = 0;
let isNativeNavigation = false; // Biến cờ đánh dấu thao tác Back/Forward native

document.addEventListener('touchstart', function (e) {
    const startX = e.touches[0].clientX;
    const windowWidth = window.innerWidth;

    // TÁCH BIỆT THAO TÁC BACK / FORWARD:
    // Nếu điểm chạm xuất phát từ sát mép trái (< 35px) hoặc sát mép phải (> windowWidth - 35px)
    // -> Đây là thao tác Vuốt Back/Forward của trình duyệt/Hệ điều hành, đánh dấu bỏ qua JS.
    if (startX < 35 || startX > (windowWidth - 35)) {
        isNativeNavigation = true;
        return;
    }

    isNativeNavigation = false;
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;

    // Lưu tọa độ riêng cho Modal Thêm Nhanh
    const quickModal = document.getElementById('quick-add-cart-modal');
    if (quickModal && !quickModal.classList.contains('hidden')) {
        quickModalTouchStartY = e.touches[0].clientY;
    }
}, { passive: true });

document.addEventListener('touchend', function (e) {
    // NẾU LÀ THAO TÁC BACK/FORWARD NATIVE: THOÁT NGAY LẬP TỨC
    // Trình duyệt sẽ thực thi hành động Back cực kỳ mượt mà không bị delay 1ms nào
    if (isNativeNavigation) return;

    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);

    // Xử lý đóng Quick Add Modal khi vuốt xuống
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

    // Xử lý vuốt mở/đóng Navigation Mobile
    const mobileNav = document.getElementById('mobile-nav-drawer');
    if (mobileNav && !mobileNav.classList.contains('hidden')) {
        if (deltaX < -50 && Math.abs(deltaX) > deltaY) {
            toggleMobileNavDrawer();
            clearAllBoldActiveStates();
            return;
        }
    }

    // Tối ưu các Drawer phụ khi Swipe Right
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

    // Xử lý Gallery ảnh
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
        if (typeof openCartModal === 'function') openCartModal();

        const pendingQuickEditIdx = sessionStorage.getItem('auto_open_quick_edit');
        if (pendingQuickEditIdx !== null) {
            sessionStorage.removeItem('auto_open_quick_edit');
            const idx = parseInt(pendingQuickEditIdx, 10);
            setTimeout(() => {
                if (typeof openQuickEdit === 'function') openQuickEdit(idx);
            }, 350);
        }
    }

    renderVisualFilterBar();
    renderCatalog(originalProducts);
    if (typeof updateCartBadge === 'function') updateCartBadge();
    checkAndOpenProductFromUrl();
});