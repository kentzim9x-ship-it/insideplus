let originalProducts = [];
let currentProduct = null;
let currentSelectedSize = null;
let currentGalleryImages = [];
let currentGalleryIndex = 0;
let currentQuantity = 1;

document.addEventListener('DOMContentLoaded', () => {
    // Tạm gọi data gốc từ SOCK, bạn có thể gọi API/JSON tổng hợp nếu cần dùng cho cả INSIDE, TSHIRT
    loadProductsData();
});

function loadProductsData() {
    // 1. Nhận diện file JSON cần tải dựa vào tiền tố màu (CS, CT, CI) trên URL
    const urlParams = new URLSearchParams(window.location.search);
    const colorParam = urlParams.get('color') || '';
    
    let jsonUrl = '../data/products_inside.json'; // Mặc định
    if (colorParam.startsWith('CS')) {
        jsonUrl = '../data/products_sock.json';
    } else if (colorParam.startsWith('CT')) {
        jsonUrl = '../data/products_tshirt.json';
    }

    // 2. Fetch đúng file JSON
    fetch(jsonUrl)
        .then(res => res.json())
        .then(data => {
            originalProducts = processRawProductsData(data);
            initProductPage(); // Gọi hàm render sau khi đã có dữ liệu
        })
        .catch(err => {
            console.error("Lỗi tải dữ liệu sản phẩm:", err);
            document.getElementById('product-content-body').innerHTML = `<h3 class="text-center w-full col-span-full py-20 text-slate-500">Lỗi kết nối dữ liệu. Vui lòng tải lại trang.</h3>`;
        });
}

function processRawProductsData(data) {
    return (Array.isArray(data) ? data : []).map((item, index) => {
        let colors = [];
        try { colors = JSON.parse(item.colorsJSON || item.colors || "[]"); } 
        catch(e) { if (Array.isArray(item.colors)) colors = item.colors; }
        colors = colors.map(c => ({ ...c, images: (c.images || []).map(img => String(img).replace(/^["']|["']$/g, '').trim()) }));
        
        let introImages = [];
        try { introImages = JSON.parse(item.introImages || "[]").map(img => String(img).replace(/^["']|["']$/g, '').trim()); } 
        catch(e) { if (Array.isArray(item.introImages)) introImages = item.introImages; }
        
        let usageGuideText = [];
        try { usageGuideText = JSON.parse(item.usageGuideText || "[]"); } 
        catch(e) { if (Array.isArray(item.usageGuideText)) usageGuideText = item.usageGuideText; }

        const cleanPrice = Number(String(item.price || item.PRICE || 0).replace(/[^0-9]/g, '')) || 0;
        const cleanOrigPrice = Number(String(item.originalPrice || item.ORIGINALPRICE || 0).replace(/[^0-9]/g, '')) || 0;

        // 3. QUAN TRỌNG: Bổ sung item.ID (chữ hoa) để mapping chính xác ID từ JSON
        const rawId = item.id || item.ID || item.productId || `SP_${index}`;

        return {
            ...item,
            id: String(rawId).trim(),
            price: cleanPrice, 
            originalPrice: cleanOrigPrice,
            colors: colors, 
            introImages: introImages, 
            usageGuideText: usageGuideText
        };
    });
}

// Bắt param trên URL để xác định sản phẩm
function initProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product');
    const colorParam = urlParams.get('color');

    if (!productParam) {
        window.location.href = '../index.html'; // Không có sản phẩm thì văng về home
        return;
    }

    const productId = String(productParam).trim().toLowerCase();
    currentProduct = originalProducts.find(item => String(item.id).toLowerCase() === productId);

    if (currentProduct) {
        // Cập nhật Breadcrumb
        document.title = `${currentProduct.name} | INSIDE+`;
        document.getElementById('breadcrumb-product-name').innerText = currentProduct.name;
        document.getElementById('breadcrumb-category').innerText = currentProduct.category || "SẢN PHẨM";

        // Lấy màu hiện tại
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
            <button onclick="event.stopPropagation(); openGalleryModal(window.currentMobileImgIdx || 0)" class="zoom-icon-btn !opacity-100 !scale-100"><i data-lucide="search" class="w-4 h-4"></i></button>
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
                <button onclick="event.stopPropagation(); openGalleryModal(${imgIdx})" class="zoom-icon-btn"><i data-lucide="search" class="w-4 h-4"></i></button>
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

    const actionBtnHtml = showOutOfStockBtn ?
        '<button disabled class="w-full bg-[#e2e8f0] text-[#64748b] py-4 px-6 font-bold text-xs uppercase tracking-widest pointer-events-none text-center">HẾT HÀNG!</button>' :
        `<div class="flex items-center gap-3">
            <div class="flex items-center border border-slate-300 bg-white px-3 py-2.5">
                <button onclick="changeQty(-1)" class="px-2 text-sm font-bold text-slate-700 hover:text-black">-</button>
                <span id="qty-input-val" class="px-3 text-sm font-bold text-slate-900">${currentQuantity}</span>
                <button onclick="changeQty(1)" class="px-2 text-sm font-bold text-slate-700 hover:text-black">+</button>
            </div>
            <button onclick="addToCart(${colorIdx})" class="flex-1 bg-slate-950 text-white py-3.5 px-6 font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition text-center">Thêm vào giỏ</button>
        </div>`;

    const container = document.getElementById('product-content-body');
    if (container) {
        window.currentMobileImgIdx = 0;
        container.innerHTML = `
        <div class="lg:col-span-8 flex flex-col space-y-6">${imagesHtml}</div>
        <div class="lg:col-span-4 flex flex-col space-y-6 sticky top-28 h-fit">
            <div>
                <span class="text-[10px] font-black uppercase text-slate-400">${p.category || 'INSIDE+'}</span>
                <h2 class="text-2xl font-black uppercase text-slate-900 mt-1">${p.name}</h2>
                <div class="flex items-center gap-3 mt-3">
                    <span class="text-2xl font-black text-slate-900">${p.price.toLocaleString('vi-VN')}đ</span>
                    ${(p.originalPrice > p.price) ? `<span class="text-sm text-slate-400 line-through">${p.originalPrice.toLocaleString('vi-VN')}đ</span> <span class="bg-slate-100 text-slate-600 font-bold text-xs px-2 py-0.5">-${Math.round((1 - p.price / p.originalPrice) * 100)}%</span>` : ''}
                </div>
            </div>
            <div class="space-y-2"><span class="text-xs font-bold uppercase text-slate-700">MÀU: <span class="font-black">${(activeColor.name || '').toUpperCase()}</span></span><div class="flex gap-2 items-center">${colorsHtml}</div></div>
            <div class="space-y-2">
                <div class="flex justify-between items-center"><div class="flex items-center gap-2"><span class="text-xs font-bold uppercase text-slate-700">KÍCH CỠ: <span class="font-black text-slate-900">${currentSelectedSize || ''}</span></span>${stockBadgeHtml}</div><button onclick="openSizeModal()" class="text-xs font-bold text-blue-600 hover:underline">Hướng dẫn chọn size</button></div>
                <div class="flex gap-2 flex-wrap">${sizesHtml}</div>
            </div>
            <div class="space-y-3 pt-2">${actionBtnHtml}</div>
            <div class="border-t border-slate-200 mt-6 pt-2">
                <button onclick="openInfoDrawer()" class="w-full py-4 flex items-center justify-between border-b border-slate-100 text-sm font-bold text-slate-900 hover:text-slate-600"><span>Thông tin sản phẩm</span><i data-lucide="chevron-right" class="w-5 h-5 text-slate-400"></i></button>
                <button onclick="openIntroDrawer()" class="w-full py-4 flex items-center justify-between border-b border-slate-100 text-sm font-bold text-slate-900 hover:text-slate-600"><span>Giới thiệu sản phẩm</span><i data-lucide="chevron-right" class="w-5 h-5 text-slate-400"></i></button>
            </div>
        </div>`;
        if (window.lucide) lucide.createIcons({ root: container });
    }
}

// LOGIC CẬP NHẬT MÀU
function changeProductColor(colorIdx) {
    renderProductContent(currentProduct, colorIdx);
    // Cập nhật lại thanh địa chỉ cho khớp màu vừa chọn
    const prefix = currentProduct.category === 'sock' ? 'CS' : 'CI';
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

function addToCart(colorIdx) {
    alert("Đã thêm " + currentQuantity + " sản phẩm vào giỏ!");
    // Ghép với logic addToCart toàn cục của dự án ở đây
}

// CÁC HÀM XỬ LÝ DRAWER & MODAL TỪ TRANG CŨ
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
    document.body.classList.add('drawer-open');
}
function closeInfoDrawer() {
    document.getElementById('info-overlay').classList.add('opacity-0');
    document.getElementById('info-panel').classList.add('translate-x-full');
    setTimeout(() => { document.getElementById('info-drawer').classList.add('hidden'); document.body.classList.remove('drawer-open'); }, 300);
}

function openIntroDrawer() {
    const p = currentProduct;
    if (!p) return;
    const imagesToDisplay = (p.introImages && p.introImages.length > 0) ? p.introImages : (p.colors && p.colors[0] ? p.colors[0].images : []);
    const contentEl = document.getElementById('intro-drawer-content');
    if (contentEl) { contentEl.innerHTML = imagesToDisplay.map((img, idx) => `<img src="${img}" class="w-full h-auto block object-cover px-3 ${idx === 0 ? 'pt-3' : ''}">`).join(''); }
    document.getElementById('intro-drawer').classList.remove('hidden');
    setTimeout(() => { document.getElementById('intro-overlay').classList.remove('opacity-0'); document.getElementById('intro-panel').classList.remove('translate-x-full'); }, 10);
    document.body.classList.add('drawer-open');
}
function closeIntroDrawer() {
    document.getElementById('intro-overlay').classList.add('opacity-0');
    document.getElementById('intro-panel').classList.add('translate-x-full');
    setTimeout(() => { document.getElementById('intro-drawer').classList.add('hidden'); document.body.classList.remove('drawer-open'); }, 300);
}

function openSizeModal() {
    document.getElementById('size-modal').classList.remove('hidden');
    document.body.classList.add('drawer-open');
}
function closeSizeModal() {
    document.getElementById('size-modal').classList.add('hidden');
    document.body.classList.remove('drawer-open');
}

// LỊCH SỬ ĐÃ XEM
function addProductToViewed(product) {
    let viewed = JSON.parse(localStorage.getItem('viewed_products') || '[]');
    viewed = viewed.filter(p => p.id !== product.id);
    viewed.unshift({
        id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, category: product.category,
        images: product.colors && product.colors[0] ? product.colors[0].images : [], colors: product.colors
    });
    if (viewed.length > 8) viewed = viewed.slice(0, 8);
    localStorage.setItem('viewed_products', JSON.stringify(viewed));
}

function renderRecentViewedSlider(currentProductId) {
    const viewed = JSON.parse(localStorage.getItem('viewed_products') || '[]');
    const container = document.getElementById('recent-viewed-slider');
    if (!container) return;
    const viewedFiltered = viewed.filter(p => p.id !== currentProductId);

    if (viewedFiltered.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 font-bold uppercase tracking-wider py-4">Chưa có sản phẩm nào khác đã xem.</p>';
        return;
    }
    container.innerHTML = viewedFiltered.map(p => {
        const img1 = (p.images && p.images[0]) || '';
        return `<div class="flex-none w-[calc(50%-12px)] lg:w-[calc(25%-18px)] group cursor-pointer" onclick="window.location.href='product.html?product=${p.id.toUpperCase()}&color=CS01'">
            <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden mb-3"><img src="${img1}" class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"></div>
            <h4 class="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-tight line-clamp-1 mb-1">${p.name}</h4>
            <div class="flex items-center gap-2"><span class="text-xs sm:text-sm font-bold text-slate-900">${p.price.toLocaleString('vi-VN')}đ</span></div>
        </div>`;
    }).join('');
}