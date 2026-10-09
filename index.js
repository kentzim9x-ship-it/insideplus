function getCategoryPageUrl(category) {
    const cat = (category || 'inside').toLowerCase();
    if (cat === 'sock') return 'SOCK/sock.html';
    if (cat === 'tshirt') return 'TSHIRT/tshirt.html';
    return 'INSIDE/inside.html';
}

let lastScrollTop = 0;
let scrollTimeout = null;

/* 1. XỬ LÝ BÔI ĐẬM LOGO INSIDE+ */
function handleLogoClick(element) {
    clearAllBoldActiveStates();
    const logoEl = element || document.getElementById('btn-logo-main');
    if (logoEl) logoEl.classList.add('btn-bold-active');
}

/* 2. XỬ LÝ BÔI ĐẬM NÚT TÌM KIẾM */
function handleSearchBtnClick(element) {
    clearAllBoldActiveStates();
    if (element) element.classList.add('btn-bold-active');
    openSearchModal();
}

/* 3. XỬ LÝ BÔI ĐẬM NÚT MENU ☰ */
function handleMenuBtnClick(element) {
    clearAllBoldActiveStates();
    if (element) element.classList.add('btn-bold-active');
    toggleMobileNavDrawer();
}

/* 4. XỬ LÝ BÔI ĐẬM CÁC NÚT X ĐÓNG */
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

/* 5. XỬ LÝ BÔI ĐẬM MỤC BÊN TRONG MENU ☰ */
function handleDrawerNavItemClick(element) {
    clearAllBoldActiveStates();
    if (element) element.classList.add('btn-bold-active');
    toggleMobileNavDrawer();
}

/* 6. XỬ LÝ MENU DƯỚI CÙNG MOBILE */
function handleBottomNavItemClick(element) {
    clearAllBoldActiveStates();
    if (element) element.classList.add('active-bold');
}

/* XÓA TẤT CẢ TRẠNG THÁI ACTIVE TRƯỚC ĐÓ VÀ KHI QUAY LẠI TRANG (BACK BUTTON) */
function clearAllBoldActiveStates() {
    document.querySelectorAll('.btn-bold-active, .active-bold').forEach(el => {
        el.classList.remove('btn-bold-active', 'active-bold');
    });
}

// Lắng nghe sự kiện quay lại trang từ cache (PAGELOAD / BACK BUTTON) để xóa trạng thái bôi đậm cũ
window.addEventListener('pageshow', () => {
    clearAllBoldActiveStates();
});

/* XỬ LÝ ĐỔI MÀU HEADER VÀ ẨN/HIỆN BOTTOM MENU KHI SCROLL */
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    const bottomNav = document.getElementById('mobile-bottom-nav');
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Đổi style Header
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Xử lý ẩn/hiện Bottom Nav trên Mobile
    if (bottomNav && window.innerWidth < 768) {
        if (currentScroll < lastScrollTop) {
            bottomNav.classList.add('nav-hidden');
        } else if (currentScroll > lastScrollTop) {
            bottomNav.classList.remove('nav-hidden');
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            bottomNav.classList.remove('nav-hidden');
        }, 150);
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

/* BẬT TẮT MOBILE NAV DRAWER TOÀN MÀN HÌNH (#363636 NỀN TRONG SUỐT) */
function toggleMobileNavDrawer() {
    const drawer = document.getElementById('mobile-nav-drawer');
    const panel = document.getElementById('mobile-nav-panel');

    if (drawer.classList.contains('hidden')) {
        drawer.classList.remove('hidden');
        setTimeout(() => {
            panel.classList.remove('-translate-x-full');
        }, 10);
    } else {
        panel.classList.add('-translate-x-full');
        setTimeout(() => {
            drawer.classList.add('hidden');
            clearAllBoldActiveStates();
        }, 300);
    }
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

function navigateToProduct(productId, category, colorIdx = 0) {
    const cleanCat = String(category || '').trim().toLowerCase();
    const formattedProduct = formatProductCode(productId, cleanCat);
    const formattedColor = formatColorCode(colorIdx, cleanCat);

    // Gom chung URL điều hướng về trang Product duy nhất
    window.location.href = `../PRODUCT/product.html?product=${encodeURIComponent(formattedProduct)}&color=${encodeURIComponent(formattedColor)}`;
}

function formatProductCode(productId, category) {
    return String(productId || '').toUpperCase();
}

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

function renderViewedProducts() {
    const viewed = JSON.parse(localStorage.getItem('viewed_products') || '[]');
    const container = document.getElementById('viewed-products-container');
    if (!container) return;

    if (viewed.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-xs text-slate-400 font-bold uppercase tracking-wider py-8">Bạn chưa xem sản phẩm nào gần đây.</p>';
        return;
    }

    container.innerHTML = viewed.map(p => {
        return `<div class="group cursor-pointer" onclick="navigateToProduct('${p.id}', '${p.category || 'sock'}', 0)">
            <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden border border-slate-100">
                <img src="${p.images ? p.images[0] : ''}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                <span class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-widest text-slate-900 px-2 py-0.5">${p.category || ''}</span>
            </div>
        </div>`;
    }).join('');
    if (window.lucide) lucide.createIcons({ root: container });
}

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

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    updateCartBadge();
    if (sessionStorage.getItem('auto_open_cart') === 'true') {
        sessionStorage.removeItem('auto_open_cart');
        openCartModal();
    }
});

// CẬP NHẬT LẮNG NGHE SỰ KIỆN ESC VÀ VUỐT MOBILE
document.addEventListener('keydown', (e) => {
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

let touchStartX = 0;
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function (e) {
    // Bỏ qua nếu người dùng vuốt từ mép trái màn hình (< 30px) để Back trang, tránh lag transition
    if (touchStartX < 30) return;

    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);

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
}, { passive: true });