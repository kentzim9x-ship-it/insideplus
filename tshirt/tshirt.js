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
        colors: [
            {
                name: "Trắng", hex: "#ffffff", images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1200"],
                sizes: [
                    { name: "S", outOfStock: false },
                    { name: "M", outOfStock: false },
                    { name: "L", outOfStock: true },
                    { name: "XL", outOfStock: true }
                ]
            },
            {
                name: "Đen", hex: "#000000", images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1200"],
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
        colors: [
            {
                name: "Đen", hex: "#000000", images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1200"],
                sizes: [
                    { name: "M", outOfStock: false },
                    { name: "L", outOfStock: false },
                    { name: "XL", outOfStock: false }
                ]
            },
            {
                name: "Trắng", hex: "#ffffff", images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200"],
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

function renderVisualFilterBar() {
    const container = document.getElementById('visual-filter-grid');
    if (!container) return;

    container.innerHTML = visualFilterCategories.map(function (item) {
        const isActive = activeVisualFilter === item.styleValue;
        const activeCardClasses = isActive ? 'visual-card-active' : '';

        return '<div onclick="selectVisualFilter(\'' + item.styleValue + '\')" class="group cursor-pointer flex flex-col bg-white transition-all duration-200 ' + activeCardClasses + '">' +
            '<div class="w-full aspect-[4/5] bg-slate-100 overflow-hidden relative">' +
            '<img src="' + item.image + '" alt="' + item.title + '" class="w-full h-full object-cover transition-transform duration-500">' +
            '</div>' +
            '<div class="pt-3.5 pb-1 text-left bg-white">' +
            '<h4 class="visual-card-title text-sm sm:text-base font-bold text-slate-900 tracking-tight transition-colors group-hover:text-black">' + item.title + '</h4>' +
            '</div>' +
            '</div>';
    }).join('');
}

function selectVisualFilter(styleVal) {
    activeVisualFilter = styleVal;

    const titleHeading = document.getElementById('page-category-title');
    if (titleHeading) {
        if (styleVal === 'ALL') {
            titleHeading.innerText = 'T-SHIRT (ÁO PHÔNG)';
        } else {
            const catObj = visualFilterCategories.find(function (c) { return c.styleValue === styleVal; });
            titleHeading.innerText = catObj ? catObj.title : ('Áo Phông ' + styleVal);
        }
    }

    if (styleVal === 'ALL') {
        // Tự động xoá toàn bộ lựa chọn filter trong Sidebar Drawer
        document.querySelectorAll('#filter-panel input').forEach(function (el) { el.checked = false; });
        document.querySelectorAll('.filter-size-btn').forEach(function (btn) { btn.classList.remove('border-slate-900', 'bg-slate-900', 'text-white', 'selected-size'); });
        document.querySelectorAll('.filter-color-btn').forEach(function (btn) { btn.classList.remove('ring-2', 'ring-slate-900', 'selected-color'); });

        // Reset nút áp dụng/xóa bộ lọc
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
        currentFilteredProducts = originalProducts.filter(function (p) {
            return p.style === styleVal;
        });
    }

    renderVisualFilterBar();
    renderCatalog(currentFilteredProducts);
}

function renderCatalog(items) {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;
    document.getElementById('catalog-count').innerText = items.length + ' sản phẩm';
    if (items.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center text-xs text-slate-400 py-12 font-bold uppercase tracking-wider">Không tìm thấy sản phẩm phù hợp.</p>';
        return;
    }
    grid.innerHTML = items.map(function (p) {
        var firstColor = p.colors[0];
        var img1 = firstColor.images[0];
        var img2 = firstColor.images[1] || img1;

        return '<div class="bg-white p-0 overflow-hidden group cursor-pointer transition" onclick="openProductDrawer(\'' + p.id + '\')">' +
            '<div class="relative w-full aspect-[3/4] bg-slate-100 overflow-hidden mb-3">' +
            '<img id="thumb-' + p.id + '" src="' + img1 + '" ' +
            'data-img1="' + img1 + '" ' +
            'data-img2="' + img2 + '" ' +
            'onmouseenter="this.src=this.getAttribute(\'data-img2\'); this.classList.add(\'scale-105\');" ' +
            'onmouseleave="this.src=this.getAttribute(\'data-img1\'); this.classList.remove(\'scale-105\');" ' +
            'class="w-full h-full object-cover transition-transform duration-500 ease-out transform">' +
            '</div>' +
            '<div class="flex items-center gap-1.5 mb-2" onclick="event.stopPropagation()">' +
            p.colors.map(function (c, cIdx) {
                var isColorOutOfStock = c.sizes && c.sizes.length > 0 && c.sizes.every(function (s) { return s.outOfStock; });
                return '<button onclick="changeCatalogThumbColor(\'' + p.id + '\',' + cIdx + ')" class="w-4 h-4 rounded-full border border-slate-300 ' + (isColorOutOfStock ? 'color-out-of-stock' : '') + '" style="background-color: ' + c.hex + ';" title="' + c.name + '"></button>';
            }).join('') +
            '</div>' +
            '<h3 class="font-bold text-slate-900 text-sm uppercase tracking-tight mb-1.5">' + p.name + '</h3>' +
            '<div class="flex items-baseline gap-2.5">' +
            '<span class="text-sm font-medium text-slate-900">' + p.price.toLocaleString('vi-VN') + 'đ</span>' +
            '<span class="text-xs text-slate-400 line-through font-normal">' + p.originalPrice.toLocaleString('vi-VN') + 'đ</span>' +
            '</div>' +
            '</div>';
    }).join('');
    if (window.lucide) lucide.createIcons();
}

function changeCatalogThumbColor(id, colorIdx) {
    const p = originalProducts.find(function (item) { return item.id === id; });
    if (!p) return;
    const targetColor = p.colors[colorIdx];
    const imgEl = document.getElementById('thumb-' + id);
    if (imgEl) {
        var newImg1 = targetColor.images[0];
        var newImg2 = targetColor.images[1] || newImg1;

        imgEl.src = newImg1;
        imgEl.setAttribute('data-img1', newImg1);
        imgEl.setAttribute('data-img2', newImg2);
    }
}

function setSortOption(type) {
    document.getElementById('sort-dropdown').classList.add('hidden');
    if (type === 'price-asc') currentFilteredProducts.sort(function (a, b) { return a.price - b.price; });
    else if (type === 'price-desc') currentFilteredProducts.sort(function (a, b) { return b.price - a.price; });
    else if (type === 'newest') currentFilteredProducts.sort(function (a, b) { return b.id.localeCompare(a.id); });
    renderCatalog(currentFilteredProducts);
}

function openProductDrawer(id) {
    const p = originalProducts.find(function (item) { return item.id === id; });
    if (!p) return;
    currentSelectedSize = null;
    renderDrawerContent(p, 0);
    document.getElementById('product-drawer').classList.remove('hidden');
    setTimeout(function () {
        document.getElementById('product-drawer-overlay').classList.remove('opacity-0');
        document.getElementById('product-drawer-panel').classList.remove('translate-x-full');
    }, 10);
}

function renderDrawerContent(p, colorIdx) {
    const activeColor = p.colors[colorIdx];
    const availableSizes = activeColor.sizes || [];

    currentGalleryImages = activeColor.images;

    if (!currentSelectedSize || !availableSizes.some(function (s) { return s.name === currentSelectedSize; })) {
        const firstAvailable = availableSizes.find(function (s) { return !s.outOfStock; });
        if (firstAvailable) currentSelectedSize = firstAvailable.name;
        else if (availableSizes.length > 0) currentSelectedSize = availableSizes[0].name;
    }

    const selectedSizeObj = availableSizes.find(function (s) { return s.name === currentSelectedSize; });
    const isSelectedSizeOutOfStock = selectedSizeObj ? selectedSizeObj.outOfStock : false;
    const isAllSizesOutOfStock = availableSizes.length > 0 && availableSizes.every(function (s) { return s.outOfStock; });

    const showOutOfStockBtn = isSelectedSizeOutOfStock || isAllSizesOutOfStock;

    var imagesHtml = activeColor.images.map(function (img, imgIdx) {
        return '<div class="product-detail-img-container aspect-[4/5] bg-slate-100 shadow-sm" onclick="openGalleryModal(' + imgIdx + ')">' +
            '<img src="' + img + '" class="w-full h-full object-cover">' +
            '<button onclick="event.stopPropagation(); openGalleryModal(' + imgIdx + ')" class="zoom-icon-btn" title="Xem ảnh">' +
            '<i data-lucide="search" class="w-4 h-4 text-slate-800"></i>' +
            '</button>' +
            '</div>';
    }).join('');

    var colorsHtml = p.colors.map(function (c, cIdx) {
        var cIsAllOutOfStock = c.sizes && c.sizes.length > 0 && c.sizes.every(function (s) { return s.outOfStock; });
        var strikeClass = cIsAllOutOfStock ? 'color-out-of-stock' : '';
        var activeClass = cIdx === colorIdx ? 'ring-2 ring-slate-900 ring-offset-2' : '';

        return '<div class="color-btn-wrapper">' +
            '<button onclick="renderDrawerContent(originalProducts.find(function(x){ return x.id===\'' + p.id + '\'}),' + cIdx + ')" ' +
            'class="w-7 h-7 rounded-full border border-slate-300 transition-all relative ' + strikeClass + ' ' + activeClass + '" ' +
            'style="background-color: ' + c.hex + ';" title="' + c.name + '">' +
            '</button>' +
            '</div>';
    }).join('');

    var sizesHtml = availableSizes.map(function (s) {
        var isSelected = currentSelectedSize === s.name;
        var btnStyle = s.outOfStock ? 'bg-slate-100/80 text-slate-300 border-slate-200 line-through' : (isSelected ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-900');

        return '<button onclick="currentSelectedSize=\'' + s.name + '\'; renderDrawerContent(originalProducts.find(function(x){ return x.id===\'' + p.id + '\'}),' + colorIdx + ')" ' +
            'class="flex-1 py-3 border text-xs font-bold transition relative ' + btnStyle + '">' + s.name + '</button>';
    }).join('');

    var actionBtnHtml = showOutOfStockBtn ?
        '<button disabled class="w-full bg-[#e2e8f0] text-[#64748b] py-4 px-6 font-bold text-xs uppercase tracking-widest pointer-events-none cursor-not-allowed text-center">HẾT HÀNG!</button>' :
        '<a href="https://shopee.vn" target="_blank" class="w-full bg-[#EE4D2D] text-white py-3.5 px-6 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition">MUA TRÊN SHOPEE MALL</a>' +
        '<a href="https://tiktok.com" target="_blank" class="w-full bg-slate-950 text-white py-3.5 px-6 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition">MUA TRÊN TIKTOK SHOP</a>';

    var policyHtml = `
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
    </div>
`;

    document.getElementById('drawer-content-body').innerHTML =
        '<div class="lg:col-span-7 flex flex-col space-y-6">' + imagesHtml + '</div>' +
        '<div class="lg:col-span-5 flex flex-col space-y-6 sticky top-24 h-fit">' +
        '<div>' +
        '<span class="text-[10px] font-black uppercase text-slate-400">INSIDE+</span>' +
        '<h2 class="text-2xl font-black uppercase text-slate-900 mt-1">' + p.name + '</h2>' +
        '<div class="flex items-baseline gap-3 mt-3">' +
        '<span class="text-2xl font-black text-slate-900">' + p.price.toLocaleString('vi-VN') + 'đ</span>' +
        '<span class="text-sm text-slate-400 line-through">' + p.originalPrice.toLocaleString('vi-VN') + 'đ</span>' +
        '</div>' +
        '</div>' +
        '<div class="space-y-2">' +
        '<span class="text-xs font-bold uppercase text-slate-700">MÀU: <span class="font-black">' + activeColor.name.toUpperCase() + '</span></span>' +
        '<div class="flex gap-2 items-center">' + colorsHtml + '</div>' +
        '</div>' +
        '<div class="space-y-2">' +
        '<div class="flex justify-between items-center">' +
        '<span class="text-xs font-bold uppercase text-slate-700">KÍCH CỠ</span>' +
        '<button onclick="openSizeModal()" class="text-xs font-bold text-blue-600 hover:underline">Hướng dẫn chọn size</button>' +
        '</div>' +
        '<div class="flex gap-2">' + sizesHtml + '</div>' +
        '</div>' +
        '<div class="space-y-2 pt-2">' + actionBtnHtml + '</div>' +
        policyHtml +
        '<div class="border-t border-slate-200 pt-6 space-y-4 text-xs text-slate-700">' +
        '<div><h4 class="font-black uppercase text-slate-900 mb-1">MÔ TẢ</h4><p class="leading-relaxed font-medium">' + p.descriptionText + '</p></div>' +
        '<div><h4 class="font-black uppercase text-slate-900 mb-1">CHẤT LIỆU</h4><p class="leading-relaxed font-medium">' + p.materialText + '</p></div>' +
        '</div>' +
        '</div>';

    if (window.lucide) lucide.createIcons();
}

function openGalleryModal(index) {
    if (!currentGalleryImages || currentGalleryImages.length === 0) return;
    currentGalleryIndex = index;
    updateGalleryModalView();
    document.getElementById('gallery-modal').classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
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
    if (currentGalleryIndex > 0) {
        currentGalleryIndex--;
    } else {
        currentGalleryIndex = currentGalleryImages.length - 1;
    }
    updateGalleryModalView();
}

function nextGalleryImage() {
    if (currentGalleryIndex < currentGalleryImages.length - 1) {
        currentGalleryIndex++;
    } else {
        currentGalleryIndex = 0;
    }
    updateGalleryModalView();
}

function closeProductDrawer() {
    document.getElementById('product-drawer-overlay').classList.add('opacity-0');
    document.getElementById('product-drawer-panel').classList.add('translate-x-full');
    setTimeout(function () { document.getElementById('product-drawer').classList.add('hidden'); }, 350);
}

function toggleSortDropdown() { document.getElementById('sort-dropdown').classList.toggle('hidden'); }
function openFilterDrawer() { document.getElementById('filter-drawer').classList.remove('hidden'); setTimeout(function () { document.getElementById('filter-overlay').classList.remove('opacity-0'); document.getElementById('filter-panel').classList.remove('translate-x-full'); }, 10); }
function closeFilterDrawer() { document.getElementById('filter-overlay').classList.add('opacity-0'); document.getElementById('filter-panel').classList.add('translate-x-full'); setTimeout(function () { document.getElementById('filter-drawer').classList.add('hidden'); }, 300); }
function toggleFilterAccordion(id) { document.getElementById(id).classList.toggle('hidden'); }
function toggleSizeSelect(btn) { btn.classList.toggle('border-slate-900'); btn.classList.toggle('bg-slate-900'); btn.classList.toggle('text-white'); btn.classList.toggle('selected-size'); onFilterChange(); }
function toggleColorSelect(btn) { btn.classList.toggle('ring-2'); btn.classList.toggle('ring-slate-900'); btn.classList.toggle('selected-color'); onFilterChange(); }

function onFilterChange() {
    const btnApply = document.getElementById('btn-apply-filter'); const btnClear = document.getElementById('btn-clear-filter');
    btnApply.disabled = false; btnApply.classList.remove('bg-slate-300', 'cursor-not-allowed'); btnApply.classList.add('bg-slate-950');
    btnClear.disabled = false; btnClear.classList.remove('text-slate-400', 'cursor-not-allowed'); btnClear.classList.add('text-slate-700', 'border-slate-900');
}

function applyFilters() {
    const selectedStyles = Array.from(document.querySelectorAll('input[name="filter-style"]:checked')).map(function (el) { return el.value; });
    const selectedSizes = Array.from(document.querySelectorAll('.filter-size-btn.selected-size')).map(function (el) { return el.getAttribute('data-val'); });
    const selectedColors = Array.from(document.querySelectorAll('.filter-color-btn.selected-color')).map(function (el) { return el.getAttribute('data-val'); });

    currentFilteredProducts = originalProducts.filter(function (p) {
        let matchVisual = (activeVisualFilter === 'ALL' || p.style === activeVisualFilter);
        let matchStyle = selectedStyles.length === 0 || selectedStyles.includes(p.style);
        let matchSize = selectedSizes.length === 0 || p.colors.some(function (c) { return c.sizes && c.sizes.some(function (s) { return selectedSizes.includes(s.name); }); });
        let matchColor = selectedColors.length === 0 || p.colors.some(function (c) { return selectedColors.includes(c.hex); });
        return matchVisual && matchStyle && matchSize && matchColor;
    });
    closeFilterDrawer();
    renderCatalog(currentFilteredProducts);
}

function clearFilters() {
    document.querySelectorAll('#filter-panel input').forEach(function (el) { el.checked = false; });
    document.querySelectorAll('.filter-size-btn').forEach(function (btn) { btn.classList.remove('border-slate-900', 'bg-slate-900', 'text-white', 'selected-size'); });
    document.querySelectorAll('.filter-color-btn').forEach(function (btn) { btn.classList.remove('ring-2', 'ring-slate-900', 'selected-color'); });

    selectVisualFilter('ALL');
}

function openSearchModal() {
    document.getElementById('search-modal').classList.remove('hidden');
    const input = document.getElementById('search-input');
    input.value = '';
    handleSearchInput('');
    if (window.lucide) lucide.createIcons();
}

function closeSearchModal() { document.getElementById('search-modal').classList.add('hidden'); }
function fillSearch(keyword) { const input = document.getElementById('search-input'); input.value = keyword; handleSearchInput(keyword); }
function clearViewedProducts() { localStorage.removeItem('viewed_products'); renderViewedProducts(); }

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

    const matches = originalProducts.filter(function (p) { return p.name.toLowerCase().includes(query.toLowerCase()); });
    if (matches.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-xs text-slate-400 font-bold uppercase tracking-wider py-8">Không tìm thấy sản phẩm nào.</p>';
        return;
    }

    container.innerHTML = matches.map(function (p) {
        return '<div class="group cursor-pointer" onclick="openProductDrawer(\'' + p.id + '\'); closeSearchModal();">' +
            '<div class="relative aspect-[3/4] bg-slate-100 overflow-hidden border border-slate-100">' +
            '<img src="' + p.colors[0].images[0] + '" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">' +
            '<span class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-widest text-slate-900 px-2 py-0.5">' + p.category + '</span>' +
            '</div>' +
            '</div>';
    }).join('');
    if (window.lucide) lucide.createIcons();
}

function renderViewedProducts() {
    const viewed = JSON.parse(localStorage.getItem('viewed_products') || '[]');
    const container = document.getElementById('viewed-products-container');
    if (!container) return;

    if (viewed.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-xs text-slate-400 font-bold uppercase tracking-wider py-8">Bạn chưa xem sản phẩm nào gần đây.</p>';
        return;
    }

    container.innerHTML = viewed.map(function (p) {
        return '<div class="group cursor-pointer" onclick="openProductDrawer(\'' + p.id + '\'); closeSearchModal();">' +
            '<div class="relative aspect-[3/4] bg-slate-100 overflow-hidden border border-slate-100">' +
            '<img src="' + p.images[0] + '" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">' +
            '<span class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-widest text-slate-900 px-2 py-0.5">' + p.category + '</span>' +
            '</div>' +
            '</div>';
    }).join('');
    if (window.lucide) lucide.createIcons();
}

function openSizeModal() { document.getElementById('size-modal').classList.remove('hidden'); if (window.lucide) lucide.createIcons(); }
function closeSizeModal() { document.getElementById('size-modal').classList.add('hidden'); }

function toggleChatMenu() {
    const group = document.getElementById('social-links-group');
    const icon = document.getElementById('chat-icon');
    group.classList.toggle('hidden');
    if (!group.classList.contains('hidden')) {
        icon.setAttribute('data-lucide', 'x');
    } else {
        icon.setAttribute('data-lucide', 'message-circle');
    }
    if (window.lucide) lucide.createIcons();
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// LẮNG NGHE PHÍM ESC ĐỂ ĐÓNG BẤT KỲ FORM HOẶC MODAL NÀO ĐANG MỞ
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        const galleryModal = document.getElementById('gallery-modal');
        if (galleryModal && !galleryModal.classList.contains('hidden')) {
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

        const productDrawer = document.getElementById('product-drawer');
        if (productDrawer && !productDrawer.classList.contains('hidden')) {
            closeProductDrawer();
            return;
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    renderVisualFilterBar();
    renderCatalog(originalProducts);
});