const visualFilterCategories = [
    {
        id: "ALL",
        title: "Tất cả",
        styleValue: "ALL",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "REGULAR",
        title: "Regular Fit",
        styleValue: "Regular",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "OVERSIZE",
        title: "Oversize Fit",
        styleValue: "Oversize",
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "CO_TRON",
        title: "Áo Cổ Tròn",
        styleValue: "CoTron",
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "COMPACT",
        title: "Cotton Compact",
        styleValue: "Compact",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "STREETWEAR",
        title: "Streetwear Style",
        styleValue: "Streetwear",
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600"
    }
];

let activeVisualFilter = "ALL";

const originalProducts = [
    {
        id: "tshirt-1", name: "Áo Phông Nam Cotton Compact Premium T-Shirt", category: "tshirt", price: 189000, originalPrice: 250000,
        style: "Regular",
        descriptionText: "Áo phông form Relaxed rộng rãi thoáng mát. Vải ứng dụng công nghệ dệt Compact hạn chế xù lông tối đa.",
        materialText: "100% Cotton Compact cao cấp siêu mịn, giữ form tốt.",
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
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1200"
        ],
        colors: [
            {
                name: "Trắng", hex: "#ffffff",
                shopeeUrl: "https://shopee.vn/product/tshirt-1-trang",
                tiktokUrl: "https://tiktok.com/product/tshirt-1-trang",
                images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1200"],
                sizes: [
                    { name: "S", outOfStock: false },
                    { name: "M", outOfStock: false },
                    { name: "L", outOfStock: true },
                    { name: "XL", outOfStock: true }
                ]
            },
            {
                name: "Đen", hex: "#000000",
                shopeeUrl: "https://shopee.vn/product/tshirt-1-den",
                tiktokUrl: "https://tiktok.com/product/tshirt-1-den",
                images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1200"],
                sizes: [
                    { name: "S", outOfStock: true },
                    { name: "M", outOfStock: true },
                    { name: "L", outOfStock: true },
                    { name: "XL", outOfStock: true }
                ]
            }
        ]
    },
    {
        id: "tshirt-2", name: "Áo Phông Oversize Nam Streetwear Style", category: "tshirt", price: 210000, originalPrice: 280000,
        style: "Oversize",
        descriptionText: "Form áo Oversize thả vai trẻ trung, cá tính.",
        materialText: "Cotton 2 chiều định lượng 250gsm đứng form.",
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
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200"
        ],
        colors: [
            {
                name: "Đen", hex: "#000000",
                shopeeUrl: "https://shopee.vn/product/tshirt-2-den",
                tiktokUrl: "https://tiktok.com/product/tshirt-2-den",
                images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1200"],
                sizes: [
                    { name: "M", outOfStock: false },
                    { name: "L", outOfStock: false },
                    { name: "XL", outOfStock: false }
                ]
            },
            {
                name: "Trắng", hex: "#ffffff",
                shopeeUrl: "https://shopee.vn/product/tshirt-2-trang",
                tiktokUrl: "https://tiktok.com/product/tshirt-2-trang",
                images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200"],
                sizes: [
                    { name: "M", outOfStock: false },
                    { name: "L", outOfStock: false },
                    { name: "XL", outOfStock: false }
                ]
            }
        ]
    }
];

let currentFilteredProducts = [...originalProducts];
let currentSelectedSize = null;
let currentGalleryImages = [];
let currentGalleryIndex = 0;

function getCategoryPageUrl(category) {
    if (category === 'sock') return '../sock/sock.html';
    if (category === 'tshirt') return '../tshirt/tshirt.html';
    return '../inside/inside.html';
}

function getCategoryPrefix(category) {
    if (category === 'sock') return 'SPS';
    if (category === 'tshirt') return 'SPT';
    return 'SPI';
}

function getColorPrefix(category) {
    if (category === 'sock') return 'CS';
    if (category === 'tshirt') return 'CT';
    return 'CI';
}

function formatProductCode(productId, category) {
    const prefix = getCategoryPrefix(category);
    const numMatch = productId.match(/\d+/);
    const num = numMatch ? parseInt(numMatch[0], 10) : 1;
    return prefix + String(num).padStart(3, '0');
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

function updateProductUrlParam(productId, colorIdx) {
    if (productId) {
        const p = originalProducts.find(item => item.id === productId);
        const category = p ? p.category : 'tshirt';
        const formattedProduct = formatProductCode(productId, category);
        const formattedColor = formatColorCode(colorIdx, category);
        const newUrl = window.location.pathname + '?product=' + encodeURIComponent(formattedProduct) + '&color=' + encodeURIComponent(formattedColor);
        window.history.pushState({ productId: productId, colorIdx: colorIdx }, '', newUrl);
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

/* TỐI ƯU VÀ LƯU TRỮ LIÊN TRANG VÀO LOCALSTORAGE (TỐI ĐA 8 SẢN PHẨM, TỰ ĐỘNG BỎ SẢN PHẨM CŨ NHẤT) */
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
        const isCurrentPage = targetPage.includes('tshirt.html');

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

window.addEventListener('popstate', function () {
    // 1. Ẩn ngay lập tức Sidebar Thông tin sản phẩm
    const infoDrawer = document.getElementById('info-drawer');
    if (infoDrawer) {
        infoDrawer.classList.add('hidden');
        const infoOverlay = document.getElementById('info-overlay');
        const infoPanel = document.getElementById('info-panel');
        if (infoOverlay) infoOverlay.classList.add('opacity-0');
        if (infoPanel) infoPanel.classList.add('translate-x-full');
    }

    // 2. Ẩn ngay lập tức Sidebar Giới thiệu sản phẩm
    const introDrawer = document.getElementById('intro-drawer');
    if (introDrawer) {
        introDrawer.classList.add('hidden');
        const introOverlay = document.getElementById('intro-overlay');
        const introPanel = document.getElementById('intro-panel');
        if (introOverlay) introOverlay.classList.add('opacity-0');
        if (introPanel) introPanel.classList.add('translate-x-full');
    }

    // 3. Đóng Modal Lightbox xem ảnh (nếu đang mở)
    const galleryModal = document.getElementById('gallery-modal');
    if (galleryModal) {
        galleryModal.classList.add('hidden');
    }

    // 4. MỞ LẠI THANH CUỘN (SCROLLBAR) CHO CẢ PRODUCT DRAWER VÀ BODY
    const productDrawer = document.getElementById('product-drawer');
    if (productDrawer) {
        productDrawer.classList.remove('drawer-open');
    }
    document.body.classList.remove('drawer-open');

    // 5. Kiểm tra URL và đóng Product Drawer để thoát về trang Category
    checkAndOpenProductFromUrl();
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
            titleHeading.innerText = 'T-SHIRT (ÁO PHÔNG)';
        } else {
            const catObj = visualFilterCategories.find(c => c.styleValue === styleVal);
            titleHeading.innerText = catObj ? catObj.title : ('Áo Phông ' + styleVal);
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
                <span class="text-xs text-slate-400 line-through font-normal">${p.originalPrice.toLocaleString('vi-VN')}đ</span>
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

/* HÀM MỞ CHI TIẾT SẢN PHẨM: ẨN SCROLLBAR CỦA CATEGORY (BODY) */
function openProductDrawer(id, colorIdx, shouldUpdateUrl) {
    const p = originalProducts.find(item => item.id === id);
    if (!p) return;

    window.currentActiveProductId = p.id;

    const initialColorIdx = (typeof colorIdx === 'number') ? colorIdx : 0;
    currentSelectedSize = null;

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

    const drawer = document.getElementById('product-drawer');
    if (drawer) {
        drawer.classList.remove('hidden');
    }

    // ẨN THANH CUỘN CỦA CATEGORY (BODY) TRÊN CẢ PC VÀ MOBILE
    document.body.classList.add('drawer-open');

    if (shouldUpdateUrl !== false) {
        if (drawer) drawer.scrollTop = 0;
        window.scrollTo(0, 0);
        updateProductUrlParam(p.id, initialColorIdx);
    }
}

function changeDrawerColor(productId, colorIdx) {
    const p = originalProducts.find(x => x.id === productId);
    if (!p) return;

    renderDrawerContent(p, colorIdx);
    updateProductUrlParam(p.id, colorIdx);

    const drawer = document.getElementById('product-drawer');
    if (drawer) {
        drawer.scrollTop = 0;
    }
    window.scrollTo(0, 0);
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
        const btnStyle = s.outOfStock ? 'bg-slate-100/80 text-slate-300 border-slate-200 line-through' : (isSelected ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-900');
        return `<button onclick="currentSelectedSize='${s.name}'; renderDrawerContent(originalProducts.find(x => x.id==='${p.id}'), ${colorIdx})" 
            class="flex-1 py-3 border text-xs font-bold transition relative ${btnStyle}">${s.name}</button>`;
    }).join('');

    const actionBtnHtml = showOutOfStockBtn ?
        '<button disabled class="w-full bg-[#e2e8f0] text-[#64748b] py-4 px-6 font-bold text-xs uppercase tracking-widest pointer-events-none cursor-not-allowed text-center">HẾT HÀNG!</button>' :
        `<a href="${activeShopeeUrl}" target="_blank" class="w-full bg-[#EE4D2D] text-white py-3.5 px-6 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition">MUA TRÊN SHOPEE MALL</a>
        <a href="${activeTiktokUrl}" target="_blank" class="w-full bg-slate-950 text-white py-3.5 px-6 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition">MUA TRÊN TIKTOK SHOP</a>`;

    const policyHtml = `
    <div class="bg-slate-50 border border-slate-100 rounded-none p-4 my-6 space-y-3.5">
        <div class="flex items-center gap-3 text-xs font-semibold text-slate-800">
            <i data-lucide="truck" class="w-4 h-4 text-slate-700 shrink-0"></i>
            <span>Miễn phí vận chuyển đơn từ 499.000 đ.</span>
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
                    <span class="text-sm text-slate-400 line-through">${p.originalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
            </div>
            <div class="space-y-2">
                <span class="text-xs font-bold uppercase text-slate-700">MÀU: <span class="font-black">${activeColor.name.toUpperCase()}</span></span>
                <div class="flex gap-2 items-center">${colorsHtml}</div>
            </div>
            <div class="space-y-2">
                <div class="flex justify-between items-center">
                    <span class="text-xs font-bold uppercase text-slate-700">KÍCH CỠ</span>
                    <button onclick="openSizeModal()" class="text-xs font-bold text-blue-600 hover:underline">Hướng dẫn chọn size</button>
                </div>
                <div class="flex gap-2">${sizesHtml}</div>
            </div>
            <div class="space-y-2 pt-2">${actionBtnHtml}</div>
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

/* ĐÓNG CHI TIẾT SẢN PHẨM: HIỆN LẠI SCROLLBAR CỦA CATEGORY (BODY) */
function closeProductDrawer(shouldUpdateUrl) {
    const drawer = document.getElementById('product-drawer');
    if (drawer) {
        drawer.classList.add('hidden');
        drawer.scrollTop = 0;
        drawer.classList.remove('drawer-open');
    }

    // BẬT LẠI THANH CUỘN CỦA TRANG CATEGORY (BODY)
    document.body.classList.remove('drawer-open');

    if (shouldUpdateUrl !== false) {
        updateProductUrlParam(null, null);
    }
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

    // Lưu lại vị trí cuộn trang hiện tại
    savedScrollPositionY = window.scrollY;

    searchModal.classList.remove('hidden');
    searchModal.scrollTop = 0; // Cuộn ô tìm kiếm lên đầu

    // Khóa cuộn trang nền bên dưới (danh mục)
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

    // Mở lại cuộn cho trang nền và giữ nguyên vị trí xem cũ
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
        const isCurrentPage = targetPage.includes('tshirt.html');

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

/* MỞ THÔNG TIN SẢN PHẨM */
/* MỞ THẺ THÔNG TIN SẢN PHẨM */
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
        <div class="space-y-3 pb-4 border-b border-slate-100">
            <div class="flex"><span class="w-24 font-bold text-slate-900">SKU</span><span class="text-slate-600">${p.id.toUpperCase()}</span></div>
            <div class="flex"><span class="w-24 font-bold text-slate-900">Chất liệu</span><span class="text-slate-600">${p.materialText}</span></div>
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

        // ẨN SCROLLBAR CỦA CHI TIẾT SẢN PHẨM (#product-drawer)
        const productDrawer = document.getElementById('product-drawer');
        if (productDrawer) productDrawer.classList.add('drawer-open');

        if (window.lucide) lucide.createIcons({ root: drawer });

        // KHÔNG dùng window.history.pushState ở đây nữa để khi Back sẽ nhảy về thẳng Category
    }
}

/* ĐÓNG SIDEBAR THÔNG TIN SẢN PHẨM */
function closeInfoDrawer() {
    const overlay = document.getElementById('info-overlay');
    const panel = document.getElementById('info-panel');
    const drawer = document.getElementById('info-drawer');

    if (overlay && panel && drawer) {
        overlay.classList.add('opacity-0');
        panel.classList.add('translate-x-full');
        setTimeout(() => {
            drawer.classList.add('hidden');

            // MỞ LẠI SCROLLBAR CHO PRODUCT DRAWER
            const productDrawer = document.getElementById('product-drawer');
            if (productDrawer) productDrawer.classList.remove('drawer-open');
        }, 300);
    }
}

/* MỞ THẺ GIỚI THIỆU SẢN PHẨM (ẢNH DỌC GHÉP LIỀN NHAU) */
function openIntroDrawer() {
    const p = originalProducts.find(x => x.id === window.currentActiveProductId);
    if (!p) return;

    // Lấy mảng ảnh giới thiệu chung của sản phẩm (nếu không khai báo thì lấy mảng ảnh màu đầu tiên làm mặc định)
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

        // ẨN SCROLLBAR CỦA CHI TIẾT SẢN PHẨM (#product-drawer)
        const productDrawer = document.getElementById('product-drawer');
        if (productDrawer) productDrawer.classList.add('drawer-open');

        if (window.lucide) lucide.createIcons({ root: drawer });
    }
}

/* ĐÓNG SIDEBAR GIỚI THIỆU SẢN PHẨM */
function closeIntroDrawer() {
    const overlay = document.getElementById('intro-overlay');
    const panel = document.getElementById('intro-panel');
    const drawer = document.getElementById('intro-drawer');

    if (overlay && panel && drawer) {
        overlay.classList.add('opacity-0');
        panel.classList.add('translate-x-full');
        setTimeout(() => {
            drawer.classList.add('hidden');

            // MỞ LẠI SCROLLBAR CHO PRODUCT DRAWER
            const productDrawer = document.getElementById('product-drawer');
            if (productDrawer) productDrawer.classList.remove('drawer-open');
        }, 300);
    }
}

window.addEventListener('resize', checkFilterSliderArrows);

/* BẮT SỰ KIỆN BÀN PHÍM ĐIỀU HƯỚNG VÀ ĐÓNG CÁC CỬA SỔ */
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

/* BẮT SỰ KIỆN VUỐT CẢM ỨNG TRÊN MOBILE */
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function (e) {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);

    const galleryModal = document.getElementById('gallery-modal');
    const isGalleryOpen = galleryModal && !galleryModal.classList.contains('hidden');

    if (isGalleryOpen) {
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > deltaY) {
            if (deltaX < 0) {
                nextGalleryImage();
            } else {
                prevGalleryImage();
            }
        }
        return;
    }

    const infoDrawer = document.getElementById('info-drawer');
    if (infoDrawer && !infoDrawer.classList.contains('hidden')) {
        if (deltaX > 60 && deltaX > deltaY) closeInfoDrawer();
        return;
    }

    const introDrawer = document.getElementById('intro-drawer');
    if (introDrawer && !introDrawer.classList.contains('hidden')) {
        if (deltaX > 60 && deltaX > deltaY) closeIntroDrawer();
        return;
    }

    if (touchStartX < 50 && deltaX > 60 && deltaX > deltaY) {
        window.history.back();
    }
    else if (touchStartX > (window.innerWidth - 50) && deltaX < -60 && deltaX > deltaY) {
        window.history.forward();
    }
}, { passive: true });

document.addEventListener('DOMContentLoaded', function () {
    renderVisualFilterBar();
    renderCatalog(originalProducts);
    checkAndOpenProductFromUrl();
});