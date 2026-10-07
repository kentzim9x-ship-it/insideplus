// --- 1. CẤU HÌNH TĨNH ---
const SHIPPING_CONFIG = {
    shippingFee: 30000, // Phí vận chuyển mặc định
    freeShippingThreshold: 399000,
    freeShippingMessage: "Bạn đã được miễn phí vận chuyển"
};

const availableVouchers = [
    { code: "INSIDE10", title: "Giảm 10%", desc: "Đơn hàng tối thiểu 500.000đ", minOrder: 500000, discountType: "percent", discountValue: 10 },
    { code: "INSIDE20", title: "Giảm 20.000đ", desc: "Đơn hàng tối thiểu 200.000đ", minOrder: 200000, discountType: "fixed", discountValue: 20000 },
    { code: "INSIDE50", title: "Giảm 50.000đ", desc: "Đơn hàng tối thiểu 300.000đ", minOrder: 300000, discountType: "fixed", discountValue: 50000 },
    { code: "INSIDE100", title: "Giảm 100.000đ", desc: "Đơn hàng tối thiểu 500.000đ", minOrder: 500000, discountType: "fixed", discountValue: 100000 }
];

// --- 2. TRẠNG THÁI TOÀN CỤC GIỎ HÀNG & VOUCHER ---
let cartItems = JSON.parse(localStorage.getItem('inside_cart') || '[]');
let activeVoucher = JSON.parse(localStorage.getItem('inside_active_voucher') || 'null');
let cartSavedScrollPositionY = 0;
let editingCartItemIndex = null;
let quickEditSelectedSize = null;
let quickEditColorIdx = 0;
let isSubtotalExpanded = false;

// Trạng thái Form Thêm Nhanh Vào Giỏ (Quick Add Modal)
let quickAddToCartProduct = null;
let quickAddToCartColorIdx = 0;
let quickAddToCartSize = null;

// --- 3. HÀM HỖ TRỢ ĐỊNH DẠNG MÃ SP & MÀU SẮC (DÙNG CHUNG) ---
function formatProductCode(productId, category) {
    const cat = (category || 'inside').toLowerCase();
    let prefix = 'SPI';
    if (cat === 'sock') prefix = 'SPS';
    if (cat === 'tshirt') prefix = 'SPT';

    const numMatch = (productId || '').match(/\d+/);
    const num = numMatch ? parseInt(numMatch[0], 10) : 1;
    return prefix + String(num).padStart(3, '0');
}

function formatColorCode(colorIdx, category) {
    const cat = (category || 'inside').toLowerCase();
    let prefix = 'CI';
    if (cat === 'sock') prefix = 'CS';
    if (cat === 'tshirt') prefix = 'CT';

    const num = (typeof colorIdx === 'number' ? colorIdx : 0) + 1;
    return prefix + String(num).padStart(2, '0');
}

function getCategoryPageUrl(category) {
    const cat = (category || 'inside').toLowerCase();
    const isInSubFolder = window.location.pathname.includes('/INSIDE/') ||
        window.location.pathname.includes('/SOCK/') ||
        window.location.pathname.includes('/TSHIRT/') ||
        window.location.pathname.includes('/inside/') ||
        window.location.pathname.includes('/sock/') ||
        window.location.pathname.includes('/tshirt/');

    const prefix = isInSubFolder ? '../' : '';

    if (cat === 'sock') return prefix + 'SOCK/sock.html';
    if (cat === 'tshirt') return prefix + 'TSHIRT/tshirt.html';
    return prefix + 'INSIDE/inside.html';
}

// --- 4. HÀM HIỂN THỊ THÔNG BÁO (TOAST NOTIFICATION) ---
function showCartToast(message) {
    const existingToast = document.getElementById('cart-toast-msg');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.id = 'cart-toast-msg';
    toast.className = 'fixed top-16 left-0 right-0 w-full sm:left-auto sm:right-0 sm:w-auto sm:max-w-md z-[9999] bg-[#1d3b8a] text-white px-4 py-3 shadow-2xl flex items-center gap-3 text-xs sm:text-sm animate-slide-in-right rounded-none sm:rounded-l-sm sm:rounded-r-none';
    
    toast.innerHTML = `
        <i data-lucide="info" class="w-4 h-4 shrink-0 text-blue-200"></i>
        <span class="flex-1 font-medium leading-tight">${message}</span>
        <button onclick="this.parentElement.remove()" class="text-white/80 hover:text-white font-bold text-base px-1 leading-none cursor-pointer">&times;</button>
    `;

    document.body.appendChild(toast);
    if (window.lucide) lucide.createIcons({ root: toast });
    setTimeout(() => {
        if (toast && toast.parentElement) toast.remove();
    }, 3500);
}

// --- 5. QUẢN LÝ GIỎ HÀNG & VOUCHER ---
function updateCartBadge() {
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const desktopBadges = document.querySelectorAll('#cart-badge-desktop');
    const mobileBadges = document.querySelectorAll('#cart-badge-mobile');
    const modalBadges = document.querySelectorAll('#cart-modal-title-badge');

    [...desktopBadges, ...mobileBadges, ...modalBadges].forEach(badge => {
        if (!badge) return;
        if (totalCount > 0) {
            badge.innerText = totalCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });

    localStorage.setItem('inside_cart', JSON.stringify(cartItems));
    localStorage.setItem('inside_active_voucher', JSON.stringify(activeVoucher));
}

function openCartModal() {
    renderCartModalContent();
    const modal = document.getElementById('cart-modal');
    if (modal) {
        cartSavedScrollPositionY = window.scrollY;
        modal.classList.remove('hidden');
        document.body.classList.add('drawer-open');
        document.body.style.top = `-${cartSavedScrollPositionY}px`;

        setTimeout(() => {
            const overlay = document.getElementById('cart-overlay');
            const panel = document.getElementById('cart-panel');
            if (overlay) overlay.classList.remove('opacity-0');
            if (panel) panel.classList.remove('translate-x-full');
        }, 10);
    }
}

function closeCartModal() {
    const overlay = document.getElementById('cart-overlay');
    const panel = document.getElementById('cart-panel');
    const modal = document.getElementById('cart-modal');
    if (overlay && panel && modal) {
        overlay.classList.add('opacity-0');
        panel.classList.add('translate-x-full');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.classList.remove('drawer-open');
            document.body.style.top = '';
            window.scrollTo(0, cartSavedScrollPositionY);
        }, 300);
    }
}

function clearAllCartItems() {
    if (cartItems.length === 0) return;
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng không?")) {
        cartItems = [];
        activeVoucher = null;
        updateCartBadge();
        renderCartModalContent();
        showCartToast("Đã xóa toàn bộ sản phẩm khỏi giỏ hàng");
    }
}

function toggleSubtotalDetails() {
    isSubtotalExpanded = !isSubtotalExpanded;
    renderCartModalContent();
}

function renderCartModalContent() {
    const container = document.getElementById('cart-content-body');
    const freeShipBanner = document.getElementById('free-ship-banner');
    const freeShipText = document.getElementById('free-ship-text');
    const subtotalEl = document.getElementById('summary-subtotal');
    const voucherDiscountRow = document.getElementById('voucher-discount-row');
    const voucherLabel = document.getElementById('selected-voucher-label');
    const clearAllBtn = document.getElementById('btn-clear-all-cart');

    const cartPanel = document.getElementById('cart-panel');

    // FIX LỖI 2 FOOTER: Ẩn/xóa tất cả các khối footer tĩnh cũ
    if (cartPanel) {
        const oldFooters = cartPanel.querySelectorAll('.border-t:not(#cart-modal-footer)');
        oldFooters.forEach(el => {
            if (!el.contains(container) && !el.contains(freeShipBanner)) {
                el.classList.add('hidden');
            }
        });
    }

    let cartFooter = document.getElementById('cart-modal-footer');

    // Đảm bảo duy nhất 1 thẻ Footer nằm ở chân giỏ hàng
    if (!cartFooter && cartPanel) {
        cartFooter = document.createElement('div');
        cartFooter.id = 'cart-modal-footer';
        cartPanel.appendChild(cartFooter);
    }

    if (!container) return;

    if (clearAllBtn) {
        if (cartItems.length > 0) clearAllBtn.classList.remove('hidden');
        else clearAllBtn.classList.add('hidden');
    }

    // ==========================================
    // 1. TRƯỜNG HỢP: GIỎ HÀNG TRỐNG
    // ==========================================
    if (cartItems.length === 0) {
        container.className = "flex-1 overflow-y-auto bg-white flex flex-col items-center justify-center";
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 px-4 text-center my-auto">
                <div class="relative mb-5">
                    <svg class="w-20 h-20 text-slate-300 stroke-[1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span class="absolute top-0 right-0 bg-[#222222] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">0</span>
                </div>
                <h3 class="text-lg font-bold text-slate-900 mb-1">Giỏ hàng trống</h3>
                <p class="text-xs sm:text-sm text-slate-400 font-medium">Không có sản phẩm nào trong giỏ hàng</p>
            </div>
        `;

        if (freeShipBanner) freeShipBanner.classList.add('hidden');
        if (voucherDiscountRow) voucherDiscountRow.classList.add('hidden');

        if (cartFooter) {
            cartFooter.innerHTML = `
                <div class="p-4 sm:p-6 border-t border-slate-100 bg-white">
                    <button onclick="closeCartModal()" class="w-full bg-[#222222] text-white py-3.5 font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-black transition cursor-pointer text-center block">
                        Bắt đầu mua sắm
                    </button>
                    <p class="text-center text-[11px] text-slate-500 font-medium mt-3">
                        // Khi cần trợ giúp vui lòng gọi <a href="tel:18001100" class="font-bold text-slate-900 underline">1800 1100</a> (Miễn phí)
                    </p>
                </div>
            `;
        }

        updateCartBadge();
        return;
    }

    // ==========================================
    // 2. TRƯỜNG HỢP: CÓ SẢN PHẨM TRONG GIỎ
    // ==========================================
    container.className = "flex-1 overflow-y-auto bg-[#f8f9fa]";

    let originalSubtotal = 0; // Giá trị đơn hàng (Chưa trừ chiết khấu)
    let directDiscount = 0;    // Tổng chiết khấu trực tiếp từ sản phẩm gốc
    let hasStockError = false;

    container.innerHTML = cartItems.map((item, idx) => {
        const itemOrigPrice = item.originalPrice || Math.round(item.price * 1.2);
        originalSubtotal += itemOrigPrice * item.quantity;
        directDiscount += (itemOrigPrice - item.price) * item.quantity;

        const codePrefix = formatProductCode(item.productId, item.category);
        const origPriceFormatted = (itemOrigPrice * item.quantity).toLocaleString('vi-VN');
        const discountPercent = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 17;

        // KIỂM TRA TỒN KHO THỰC TẾ
        const stockCheck = checkProductStock(item.productId, item.colorName, item.size, item.quantity);
        let stockWarningHtml = '';

        if (!stockCheck.valid || item.quantity > stockCheck.maxStock) {
            hasStockError = true;
            stockWarningHtml = `<p class="text-red-600 font-bold text-xs pt-1.5">* Vượt quá số lượng tồn kho (Còn lại: ${stockCheck.maxStock})</p>`;
        }

        return `<div class="flex gap-4 py-5 px-4 border-b border-slate-100 bg-white items-start relative group w-full">
            <img src="${item.image}" class="w-24 h-32 sm:w-32 sm:h-36 object-cover bg-slate-100 cursor-pointer shrink-0" onclick="openProductDrawerFromCart('${item.productId}', '${item.colorName}', '${item.category}')">
            
            <div class="flex-1 min-w-0 pr-6 space-y-1.5">
                <span class="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">INSIDE+</span>
                <h4 class="font-bold text-xs sm:text-sm uppercase text-slate-900 cursor-pointer hover:underline truncate leading-snug" onclick="openProductDrawerFromCart('${item.productId}', '${item.colorName}', '${item.category}')">${item.name}</h4>
                <p class="text-xs sm:text-sm text-slate-500 font-normal">${item.colorName} - ${codePrefix} &nbsp;|&nbsp; Size: ${item.size}</p>
                
                <div class="flex items-baseline gap-2 pt-1">
                    <span class="text-xs sm:text-sm text-slate-400 line-through font-normal">${origPriceFormatted} đ</span>
                    <span class="text-[11px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5">-${discountPercent}%</span>
                </div>

                <div class="flex items-center justify-between pt-3">
                    <span class="text-base font-bold text-slate-900">${(item.price * item.quantity).toLocaleString('vi-VN')} đ</span>
                    
                    <div class="flex items-center border border-slate-200 text-xs sm:text-sm">
                        <button onclick="updateCartItemQty(${idx}, -1)" class="px-3 py-1 text-slate-500 hover:bg-slate-100 font-bold cursor-pointer">-</button>
                        <span class="px-3 py-1 text-slate-900 font-bold border-x border-slate-200 bg-white">${item.quantity}</span>
                        <button onclick="updateCartItemQty(${idx}, 1)" class="px-3 py-1 text-slate-500 hover:bg-slate-100 font-bold cursor-pointer">+</button>
                    </div>
                </div>

                <!-- CẢNH BÁO TỒN KHO NẾU CÓ -->
                ${stockWarningHtml}
            </div>
            
            <div class="absolute top-5 right-3">
                <button onclick="toggleItemMenu(${idx})" class="p-1 text-slate-400 hover:text-black focus:outline-none cursor-pointer">
                    <i data-lucide="more-vertical" class="w-4 h-4"></i>
                </button>
                <div id="item-menu-${idx}" class="absolute right-0 top-6 w-48 bg-white border border-slate-200 shadow-xl hidden z-20 py-1 text-xs sm:text-sm">
                    <button onclick="openQuickEdit(${idx})" class="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                        <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5"></i> Sửa màu sắc, size
                    </button>
                    <button onclick="removeCartItem(${idx})" class="w-full text-left px-3 py-2 text-red-600 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Xóa sản phẩm
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');

    const currentPriceTotal = originalSubtotal - directDiscount;
    let voucherDiscount = 0;
    let voucherTitleText = '';

    if (activeVoucher) {
        if (currentPriceTotal >= activeVoucher.minOrder) {
            voucherDiscount = activeVoucher.discountType === 'percent'
                ? Math.round((currentPriceTotal * activeVoucher.discountValue) / 100)
                : activeVoucher.discountValue;

            voucherTitleText = activeVoucher.title 
                ? `${activeVoucher.title} (${activeVoucher.desc || activeVoucher.code})` 
                : activeVoucher.code;

            if (voucherLabel) voucherLabel.innerText = activeVoucher.code;
        } else {
            activeVoucher = null;
            if (voucherLabel) voucherLabel.innerText = 'Chọn hoặc nhập mã';
        }
    } else if (voucherLabel) {
        voucherLabel.innerText = 'Chọn hoặc nhập mã';
    }

    const finalTotal = Math.max(0, currentPriceTotal - voucherDiscount);
    if (subtotalEl) subtotalEl.innerText = originalSubtotal.toLocaleString('vi-VN') + ' đ';

    if (freeShipBanner && freeShipText) {
        freeShipBanner.classList.remove('hidden');
        if (currentPriceTotal >= SHIPPING_CONFIG.freeShippingThreshold) {
            freeShipBanner.className = "py-3.5 px-4 bg-[#dce3f6] text-[#2c3e6b] text-center w-full transition-all duration-200";
            freeShipText.innerHTML = `<div class="text-xs sm:text-sm sm:text-base font-normal tracking-wide">${SHIPPING_CONFIG.freeShippingMessage}</div>`;
        } else {
            const needed = SHIPPING_CONFIG.freeShippingThreshold - currentPriceTotal;
            freeShipBanner.className = "py-3.5 px-4 bg-slate-100 text-slate-700 text-center w-full transition-all duration-200";
            freeShipText.innerHTML = `<div class="text-xs sm:text-sm sm:text-base font-normal">Mua thêm <span class="font-bold text-slate-900">${needed.toLocaleString('vi-VN')} đ</span> để được <span class="text-blue-600 font-bold uppercase">MIỄN PHÍ VẬN CHUYỂN</span></div>`;
        }
    }

    // Quản lý trạng thái Nút Thanh toán
    const checkoutBtnClass = !hasStockError
        ? "bg-[#222222] text-white hover:bg-black cursor-pointer font-bold"
        : "bg-[#cccccc] text-white cursor-not-allowed font-bold";

    if (cartFooter) {
        // Icon mũi tên trỏ lên khi mở (isSubtotalExpanded = true), trỏ xuống khi đóng
        const arrowLucideIcon = isSubtotalExpanded ? 'chevron-up' : 'chevron-down';

        let expandedHtml = '';
        if (isSubtotalExpanded) {
            expandedHtml = `
                <div class="space-y-2 pt-2 border-t border-slate-100 text-xs sm:text-sm">
                    <div class="flex justify-between items-center text-slate-600 font-normal">
                        <span>Giá trị đơn hàng</span>
                        <span class="text-slate-900 font-medium">${originalSubtotal.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div class="flex justify-between items-center text-slate-600 font-normal">
                        <span>Giảm giá trực tiếp</span>
                        <span class="text-red-500 font-medium">-${directDiscount.toLocaleString('vi-VN')} đ</span>
                    </div>
                    ${voucherDiscount > 0 ? `
                    <div class="flex justify-between items-center text-slate-600 font-normal">
                        <span>${voucherTitleText}</span>
                        <span class="text-red-500 font-medium">-${voucherDiscount.toLocaleString('vi-VN')} đ</span>
                    </div>
                    ` : ''}
                </div>
            `;
        }

        cartFooter.innerHTML = `
    <div class="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-3 font-['Montserrat']">
        
        <!-- KHỐI CHỨA TIÊU ĐỀ & NÚT ĐỔI MÃ GIẢM GIÁ -->
        <div>
            <!-- HÀNG CĂN THẲNG NGANG BẰNG ITEMS-CENTER -->
            <div class="flex justify-between items-center text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 leading-none">
                <span>MÃ GIẢM GIÁ</span>
                
                <button onclick="openVoucherDrawer()" class="text-blue-600 hover:underline flex items-center gap-1 font-bold text-xs sm:text-sm cursor-pointer shrink-0">
                    <span>${activeVoucher ? 'Đổi hoặc nhập mã' : 'Chọn hoặc nhập mã'}</span>
                    <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                </button>
            </div>

            <!-- HASHTAG HIỂN THỊ HÀNG BÊN DƯỚI -->
            ${activeVoucher ? `<div class="pt-1.5"><span class="inline-block bg-blue-50 text-blue-600 font-bold text-[11px] px-2 py-0.5 font-mono">${activeVoucher.code}</span></div>` : ''}
        </div>

        ${expandedHtml}

        <!-- TẠM TÍNH: MŨI TÊN ĐƯỢC ĐẶT NGAY BÊN CẠNH CHỮ TẠM TÍNH -->
        <div class="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-900 cursor-pointer pt-1" onclick="toggleSubtotalDetails()">
            <div class="flex items-center gap-1 uppercase tracking-wider">
                <span>TẠM TÍNH</span>
                <i data-lucide="${arrowLucideIcon}" class="w-4 h-4 text-slate-600"></i>
            </div>
            <span class="text-base font-bold text-slate-900">${finalTotal.toLocaleString('vi-VN')} đ</span>
        </div>

        <button onclick="handleCheckoutRedirect()" ${hasStockError ? 'disabled' : ''} class="w-full py-3.5 text-md uppercase tracking-widest transition block mt-2 ${checkoutBtnClass}">
            Thanh toán
        </button>
    </div>
`;
    }

    updateCartBadge();
    if (window.lucide) lucide.createIcons({ root: container });
    if (window.lucide && cartFooter) lucide.createIcons({ root: cartFooter });
}

function checkProductStock(productId, colorName, sizeName, requestedQty) {
    const product = typeof findProductAnywhere === 'function' 
        ? findProductAnywhere(productId) 
        : (typeof originalProducts !== 'undefined' ? originalProducts.find(p => p.id === productId) : null);

    if (!product) return { valid: true, maxStock: 999 };

    const colorObj = product.colors.find(c => c.name === colorName) || product.colors[0];
    if (!colorObj) return { valid: true, maxStock: 999 };

    const defaultSizes = [{ name: 'S', stock: 50 }, { name: 'M', stock: 15 }, { name: 'L', stock: 0 }, { name: 'XL', stock: 30 }, { name: 'XXL', stock: 40 }];
    const availableSizes = colorObj.sizes || defaultSizes;
    const sizeObj = availableSizes.find(s => s.name === sizeName);

    if (!sizeObj) return { valid: true, maxStock: 999 };

    const isOutOfStock = sizeObj.outOfStock || sizeObj.stock === 0;
    const maxStock = sizeObj.stock !== undefined ? sizeObj.stock : (isOutOfStock ? 0 : 50);

    return {
        valid: requestedQty <= maxStock && maxStock > 0,
        maxStock: maxStock,
        isOutOfStock: isOutOfStock
    };
}


function updateCartItemQty(index, delta) {
    const item = cartItems[index];
    if (!item) return;

    const newQty = item.quantity + delta;

    if (newQty <= 0) {
        removeCartItem(index);
        return;
    }

    // Kiểm tra với stock thực tế
    const stockCheck = checkProductStock(item.productId, item.colorName, item.size, newQty);

    if (!stockCheck.valid && delta > 0) {
        showCartToast(`Rất tiếc! Kích cỡ ${item.size} chỉ còn lại ${stockCheck.maxStock} sản phẩm trong kho.`);
        return;
    }

    item.quantity = newQty;
    updateCartBadge();
    renderCartModalContent();
}

// Cập nhật hàm xử lý nút Thanh toán (handleCheckoutRedirect)
function handleCheckoutRedirect() {
    if (cartItems.length === 0) {
        alert('Giỏ hàng của bạn đang trống!');
        return;
    }

    // Kiểm tra tồn kho trước khi cho thanh toán
    for (let item of cartItems) {
        const stockCheck = checkProductStock(item.productId, item.colorName, item.size, item.quantity);
        if (!stockCheck.valid) {
            alert(`Sản phẩm "${item.name}" (Màu: ${item.colorName}, Size: ${item.size}) vượt quá số lượng tồn kho (Còn lại: ${stockCheck.maxStock}). Vui lòng điều chỉnh lại trước khi thanh toán!`);
            return;
        }
    }

    // ĐẢM BẢO ĐỒNG BỘ NGUYÊN BẢN GIỎ HÀNG VÀ VOUCHER VÀO LOCALSTORAGE
    localStorage.setItem('inside_cart', JSON.stringify(cartItems));
    localStorage.setItem('inside_active_voucher', JSON.stringify(activeVoucher));

    // Xác định đường dẫn tương đối chuẩn xác
    const isInSubFolder = window.location.pathname.includes('/INSIDE/') ||
        window.location.pathname.includes('/SOCK/') ||
        window.location.pathname.includes('/TSHIRT/') ||
        window.location.pathname.includes('/inside/') ||
        window.location.pathname.includes('/sock/') ||
        window.location.pathname.includes('/tshirt/');

    const prefix = isInSubFolder ? '../' : '';

    // Chuyển hướng sang checkout.html
    window.location.href = prefix + 'checkout.html';
}

function removeCartItem(index) {
    const removedItem = cartItems[index];
    if (removedItem) {
        cartItems.splice(index, 1);
        showCartToast(`${removedItem.name} đã được xóa thành công khỏi giỏ hàng`);
    }
    updateCartBadge();
    renderCartModalContent();
}

function toggleItemMenu(idx) {
    document.querySelectorAll('[id^="item-menu-"]').forEach((el, i) => {
        if (i !== idx) el.classList.add('hidden');
    });
    const menu = document.getElementById(`item-menu-${idx}`);
    if (menu) menu.classList.toggle('hidden');
}

function openVoucherDrawer() {
    renderVoucherList();
    const drawer = document.getElementById('voucher-drawer');
    if (drawer) {
        drawer.classList.remove('hidden');
        setTimeout(() => {
            const overlay = document.getElementById('voucher-overlay');
            const panel = document.getElementById('voucher-panel');
            if (overlay) overlay.classList.remove('opacity-0');
            if (panel) panel.classList.remove('translate-x-full');
        }, 10);
    }
}

function closeVoucherDrawer() {
    const overlay = document.getElementById('voucher-overlay');
    const panel = document.getElementById('voucher-panel');
    const drawer = document.getElementById('voucher-drawer');
    if (overlay && panel && drawer) {
        overlay.classList.add('opacity-0');
        panel.classList.add('translate-x-full');
        setTimeout(() => drawer.classList.add('hidden'), 300);
    }
}

function renderVoucherList() {
    const container = document.getElementById('voucher-list-container');
    if (!container) return;

    let currentSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    container.innerHTML = availableVouchers.map(v => {
        const isSelected = activeVoucher && activeVoucher.code === v.code;
        const canApply = currentSubtotal >= v.minOrder;

        let btnHtml = '';
        if (isSelected) {
            btnHtml = `<button onclick="selectVoucher('${v.code}')" class="px-4 py-2 bg-emerald-600 text-white text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-emerald-700 transition shadow">ĐÃ CHỌN ✓</button>`;
        } else if (canApply) {
            btnHtml = `<button onclick="selectVoucher('${v.code}')" class="px-4 py-2 bg-slate-950 text-white text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-slate-800 transition">CHỌN MÃ</button>`;
        } else {
            btnHtml = `<button disabled class="px-3 py-2 bg-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider cursor-not-allowed">CHƯA ĐỦ ĐIỀU KIỆN</button>`;
        }

        const cardStyle = isSelected
            ? 'bg-emerald-50/60 border-2 border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
            : 'bg-white border border-slate-300 shadow-sm hover:border-slate-400';

        const tagStyle = isSelected
            ? 'bg-emerald-600 text-white'
            : 'bg-slate-100 text-slate-800';

        return `<div class="relative my-4 mx-1">
            <div class="${cardStyle} p-4 transition-all duration-200">
                <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="space-y-1">
                        <span class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${tagStyle}">VOUCHER CHÍNH HÃNG</span>
                        <h4 class="font-black text-lg uppercase text-slate-900 pt-1">${v.title}</h4>
                        <p class="text-xs sm:text-sm text-slate-500 font-medium">${v.desc}</p>
                    </div>
                </div>
                
                <div class="border-t-2 border-dashed border-slate-300 my-3 relative">
                    <div class="absolute -left-6 -top-2 w-4 h-4 bg-[#f8fafc] border-r border-slate-300 rounded-full"></div>
                    <div class="absolute -right-6 -top-2 w-4 h-4 bg-[#f8fafc] border-l border-slate-300 rounded-full"></div>
                </div>
                
                <div class="flex items-center justify-between pt-1">
                    <div>
                        <span class="block text-[9px] font-bold uppercase text-slate-400">MÃ GIẢM GIÁ</span>
                        <span class="text-lg font-mono font-black ${isSelected ? 'text-emerald-700' : 'text-slate-900'}">${v.code}</span>
                    </div>
                    <div>${btnHtml}</div>
                </div>
            </div>
        </div>`;
    }).join('');
}

function selectVoucher(code) {
    const v = availableVouchers.find(item => item.code === code);
    if (!v) return;

    let currentSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (activeVoucher && activeVoucher.code === code) {
        activeVoucher = null;
    } else {
        if (currentSubtotal >= v.minOrder) {
            activeVoucher = v;
        } else {
            alert('Đơn hàng chưa đạt mức tối thiểu để áp dụng mã này!');
            return;
        }
    }
    renderVoucherList();
    renderCartModalContent();
}

function handleManualVoucherInput() {
    const input = document.getElementById('manual-voucher-input');
    const btn = document.getElementById('btn-apply-manual-voucher');
    if (!input || !btn) return;

    if (input.value.trim().length > 0) {
        btn.disabled = false;
        btn.className = "px-6 py-3.5 bg-slate-950 text-white font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-slate-800 transition cursor-pointer";
    } else {
        btn.disabled = true;
        btn.className = "px-6 py-3.5 bg-slate-200 text-slate-400 font-black text-xs sm:text-sm uppercase tracking-widest cursor-not-allowed transition";
    }
}

function applyManualVoucher() {
    const input = document.getElementById('manual-voucher-input');
    if (!input) return;
    const code = input.value.trim().toUpperCase();
    if (!code) return;

    const v = availableVouchers.find(item => item.code === code);
    let currentSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (v) {
        if (currentSubtotal >= v.minOrder) {
            activeVoucher = v;
            renderCartModalContent();
            renderVoucherList();
            closeVoucherDrawer();
        } else {
            alert(`Đơn hàng cần tối thiểu ${v.minOrder.toLocaleString('vi-VN')}đ để áp dụng mã này!`);
        }
    } else {
        alert('Mã ưu đãi không hợp lệ hoặc đã hết hạn!');
    }
}

// --- 6. FORM THÊM NHANH VÀO GIỎ HÀNG (QUICK ADD MODAL) ---

function attachQuickAddHoverEvents() {
    document.querySelectorAll('.product-card, [data-product-id]').forEach(card => {
        const imgWrapper = card.querySelector('.product-img-wrapper') || card.querySelector('div:has(img)');
        if (!imgWrapper || imgWrapper.querySelector('.quick-add-btn')) return;

        imgWrapper.style.position = 'relative';

        const btn = document.createElement('button');
        btn.className = "quick-add-btn absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#1d3b8a] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg cursor-pointer z-10";
        btn.innerHTML = `<svg class="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>`;

        const productId = card.getAttribute('data-product-id') || card.dataset.id;
        btn.onclick = (e) => {
            e.stopPropagation();
            openQuickAddToCartModal(productId);
        };

        imgWrapper.appendChild(btn);
    });
}

let isQuickAddFirstOpen = false;

let quickAddSavedScrollY = 0; // Biến lưu vị trí cuộn

function openQuickAddToCartModal(productId) {
    quickAddToCartProduct = typeof findProductAnywhere === 'function'
        ? findProductAnywhere(productId)
        : originalProducts.find(x => x.id === productId);

    if (!quickAddToCartProduct) return;

    quickAddToCartColorIdx = 0;
    quickAddToCartSize = null;
    quickAddImageIdx = 0; 

    let modal = document.getElementById('quick-add-cart-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quick-add-cart-modal';
        modal.className = "fixed inset-0 z-[9999] flex items-end sm:items-center justify-center hidden";
        document.body.appendChild(modal);
    }

    renderQuickAddToCartModalContent();
    modal.classList.remove('hidden');

    // Bật hiệu ứng mờ nền Backdrop và trượt Popup
    const backdrop = document.getElementById('quick-add-backdrop');
    const container = document.getElementById('quick-add-container');

    if (backdrop) backdrop.classList.remove('opacity-0');
    if (container) {
        container.classList.remove('quick-add-anim-out');
        container.classList.add('quick-add-anim-in');
    }

    // Lưu vị trí cuộn trang hiện tại
    quickAddSavedScrollY = window.scrollY || document.documentElement.scrollTop;
    document.body.classList.add('drawer-open');
    document.body.style.top = `-${quickAddSavedScrollY}px`;
}

function closeQuickAddToCartModal() {
    const backdrop = document.getElementById('quick-add-backdrop');
    const container = document.getElementById('quick-add-container');
    const modal = document.getElementById('quick-add-cart-modal');

    if (backdrop) backdrop.classList.add('opacity-0');
    if (container) {
        container.classList.remove('quick-add-anim-in');
        container.classList.add('quick-add-anim-out');
    }

    // Chờ 250ms cho animation đóng chạy xong mới ẩn phần tử
    setTimeout(() => {
        if (modal) modal.classList.add('hidden');
        document.body.classList.remove('drawer-open');
        document.body.style.top = '';
        window.scrollTo(0, quickAddSavedScrollY);
    }, 250);
}

function selectQuickAddColor(colorIdx) {
    quickAddToCartColorIdx = colorIdx;
    quickAddToCartSize = null; // Reset size khi đổi màu
    quickAddImageIdx = 0;      // Reset về ảnh đầu tiên của màu mới
    renderQuickAddToCartModalContent();
}

function selectQuickAddSize(sizeName) {
    quickAddToCartSize = sizeName;
    renderQuickAddToCartModalContent();
}

// Hàm chuyển ảnh tiếp theo / quay lại trong Popup
function changeQuickAddImage(delta) {
    if (!quickAddToCartProduct) return;
    const activeColor = quickAddToCartProduct.colors[quickAddToCartColorIdx] || quickAddToCartProduct.colors[0];
    const images = activeColor.images || [];
    if (images.length === 0) return;

    quickAddImageIdx = (quickAddImageIdx + delta + images.length) % images.length;
    renderQuickAddToCartModalContent();
}

// Biến hỗ trợ nhận diện thao tác vuốt ảnh trên Mobile
let quickAddTouchStartX = 0;

function handleQuickAddTouchStart(e) {
    quickAddTouchStartX = e.touches[0].clientX;
}

function handleQuickAddTouchEnd(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - quickAddTouchStartX;
    if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) {
            changeQuickAddImage(1);  // Vuốt sang trái -> Xem ảnh tiếp
        } else {
            changeQuickAddImage(-1); // Vuốt sang phải -> Xem ảnh trước
        }
    }
}

// Biến lưu số lượng nhập trong popup/chi tiết
let quickAddToCartQty = 1;

function updateQuickAddQty(delta) {
    const newQty = quickAddToCartQty + delta;
    if (newQty < 1) return;
    quickAddToCartQty = newQty;
    renderQuickAddToCartModalContent();
}

function handleQuickAddQtyInput(val) {
    const parsed = parseInt(val, 10);
    quickAddToCartQty = isNaN(parsed) || parsed < 1 ? 1 : parsed;
    renderQuickAddToCartModalContent();
}

function renderQuickAddToCartModalContent() {
    const modal = document.getElementById('quick-add-cart-modal');
    if (!modal || !quickAddToCartProduct) return;

    const p = quickAddToCartProduct;
    const activeColor = p.colors[quickAddToCartColorIdx] || p.colors[0];
    const images = activeColor.images && activeColor.images.length > 0 
        ? activeColor.images 
        : ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600"];
    
    if (quickAddImageIdx >= images.length) quickAddImageIdx = 0;
    const currentImg = images[quickAddImageIdx];

    const origPriceFormatted = (p.originalPrice || Math.round(p.price * 1.2)).toLocaleString('vi-VN');
    const discountPercent = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 14;

    // Danh sách chọn màu (Đã thêm p-1 để nút màu không bị khuất/xén viền ring)
    const colorsHtml = p.colors.map((c, idx) => {
        const isSelected = idx === quickAddToCartColorIdx;
        const ring = isSelected ? 'ring-2 ring-slate-900 ring-offset-2' : 'border-slate-300';
        return `<div class="p-1 shrink-0 flex items-center justify-center">
            <button onclick="selectQuickAddColor(${idx})" class="w-7 h-7 rounded-full border ${ring} transition cursor-pointer block" style="background-color: ${c.hex || '#000'};" title="${c.name}"></button>
        </div>`;
    }).join('');

    // Danh sách chọn Kích cỡ & Tồn kho
    const defaultSizes = [{ name: 'S', stock: 50 }, { name: 'M', stock: 15 }, { name: 'L', stock: 0 }, { name: 'XL', stock: 30 }, { name: 'XXL', stock: 40 }];
    const availableSizes = activeColor.sizes || defaultSizes;
    const selectedSizeObj = availableSizes.find(s => s.name === quickAddToCartSize);

    let stockBadgeHtml = '';
    let isBtnDisabled = false;
    let maxStock = 999;
    let errorMessage = '';

    if (!quickAddToCartSize) {
        stockBadgeHtml = `<span class="bg-[#222222] text-white text-[10px] px-2 py-0.5 font-medium rounded-xs">Chọn kích cỡ</span>`;
        isBtnDisabled = true;
    } else if (selectedSizeObj) {
        const isOutOfStock = selectedSizeObj.outOfStock || selectedSizeObj.stock === 0;
        maxStock = selectedSizeObj.stock !== undefined ? selectedSizeObj.stock : (isOutOfStock ? 0 : 50);

        if (isOutOfStock || maxStock === 0) {
            stockBadgeHtml = `<span class="text-red-600 font-bold text-xs">Hết hàng</span>`;
            isBtnDisabled = true;
        } else if (quickAddToCartQty > maxStock) {
            // CẢNH BÁO KHI VƯỢT QUÁ STOCK
            stockBadgeHtml = `<span class="text-red-600 font-bold text-xs">Chỉ còn ${maxStock} sản phẩm trong kho</span>`;
            errorMessage = `<p class="text-red-600 text-xs font-bold mt-1">Số lượng chọn (${quickAddToCartQty}) vượt quá tồn kho (${maxStock})!</p>`;
            isBtnDisabled = true;
        } else if (maxStock < 20) {
            stockBadgeHtml = `<span class="text-amber-600 font-bold text-xs">Sắp hết hàng (Còn ${maxStock})</span>`;
            isBtnDisabled = false;
        } else {
            stockBadgeHtml = `<span class="text-emerald-600 font-bold text-xs"></span>`;
            isBtnDisabled = false;
        }
    }

    const btnClass = !isBtnDisabled
        ? "bg-[#222222] text-white hover:bg-black cursor-pointer font-bold"
        : "bg-[#cccccc] text-white cursor-not-allowed font-bold";

    const sizesHtml = availableSizes.map(s => {
        const isSelected = quickAddToCartSize === s.name;
        const isOutOfStock = s.outOfStock || s.stock === 0;

        let style = '';
        if (isSelected) {
            style = 'bg-[#222222] text-white border-[#222222] font-bold';
        } else if (isOutOfStock) {
            style = 'bg-slate-50 text-slate-300 border-slate-200 font-normal';
        } else {
            style = 'bg-white text-slate-800 border-slate-200 hover:border-slate-400 font-medium';
        }

        return `<button onclick="selectQuickAddSize('${s.name}')" class="w-11 h-11 border text-xs sm:text-sm transition flex items-center justify-center cursor-pointer ${style}">${s.name}</button>`;
    }).join('');

    const slideAnimationClass = isQuickAddFirstOpen ? 'animate-slide-up sm:animate-scale-up' : '';
    isQuickAddFirstOpen = false;

    modal.innerHTML = `
        <div class="fixed inset-0 bg-black/50 z-[200] flex items-end sm:items-center justify-center" onclick="closeQuickAddToCartModal()">
            <div onclick="event.stopPropagation()" class="bg-white w-full sm:max-w-2xl rounded-none sm:rounded-sm overflow-hidden shadow-2xl relative ${slideAnimationClass} max-h-[90vh] sm:max-h-none overflow-y-auto">
                
                <!-- Header Modal -->
                <div class="flex justify-between items-center px-5 py-3.5 sm:px-6 sm:py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <h3 class="font-bold text-lg sm:text-xl text-slate-900">Thêm nhanh vào giỏ</h3>
                    <button onclick="closeQuickAddToCartModal()" class="text-slate-900 hover:text-black font-bold text-3xl cursor-pointer">&times;</button>
                </div>

                <!-- 1. GIAO DIỆN MOBILE (Bottom Sheet) -->
                <div class="block sm:hidden p-4 space-y-4">
                    <!-- Ảnh sản phẩm -->
                    <div class="flex gap-4 items-start">
                        <div class="w-28 aspect-[3/4] bg-slate-100 rounded-sm overflow-hidden shrink-0 relative select-none"
                             ontouchstart="handleQuickAddTouchStart(event)" 
                             ontouchend="handleQuickAddTouchEnd(event)">
                            <img src="${currentImg}" class="w-full h-full object-cover pointer-events-none">
                            <span class="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium">${quickAddImageIdx + 1}/${images.length}</span>
                        </div>

                        <div class="space-y-1 flex-1 min-w-0">
                            <span class="bg-[#f0f0f0] text-slate-600 px-1.5 py-0.5 text-[9px] font-bold inline-block">INSIDE</span>
                            <h4 class="font-bold text-xs sm:text-sm text-slate-900 uppercase leading-snug line-clamp-2">${p.name}</h4>
                            <p class="text-slate-400 text-[10px]">SKU: ${typeof formatProductCode === 'function' ? formatProductCode(p.id, p.category) : p.id}</p>

                            <div class="flex items-baseline gap-2 pt-0.5">
                                <span class="text-slate-400 line-through text-[11px]">${origPriceFormatted} đ</span>
                                <span class="bg-slate-100 text-slate-600 px-1 py-0.2 font-bold text-[9px]">-${discountPercent}%</span>
                            </div>
                            <p class="text-lg font-bold text-slate-900">${p.price.toLocaleString('vi-VN')} đ</p>
                        </div>
                    </div>

                    <!-- Chọn Màu (Đã sửa hiển thị đầy đủ không khuất viền) -->
                    <div>
                        <span class="text-slate-500 text-xs sm:text-sm">Màu: <strong class="text-slate-800 font-bold">${activeColor.name}</strong></span>
                        <div class="flex gap-1 pt-1 overflow-x-auto no-scrollbar items-center">${colorsHtml}</div>
                    </div>

                    <!-- Chọn Size -->
                    <div>
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-slate-500 text-xs sm:text-sm">Kích cỡ:</span>
                            ${quickAddToCartSize ? `<strong class="text-slate-800 font-bold text-xs sm:text-sm">${quickAddToCartSize}</strong>` : ''}
                            ${stockBadgeHtml}
                        </div>
                        <div class="flex gap-2 flex-wrap">${sizesHtml}</div>
                    </div>

                    <!-- Nút Thêm vào giỏ -->
                    <div class="pt-2 pb-1">
                        <button onclick="submitQuickAddToCart()" ${isBtnDisabled ? 'disabled' : ''} class="w-full py-3 text-xs sm:text-sm uppercase tracking-wider transition ${btnClass}">
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>

                <!-- 2. GIAO DIỆN DESKTOP (PC: Đã bỏ padding trên/dưới p-0 cho khung ảnh) -->
                <div class="hidden sm:block p-6">
                    <div class="grid grid-cols-2 gap-8 items-start">
                        
                        <!-- Khung Ảnh Bên Trái (Khung nền xám nhẹ p-0 không có padding thừa) -->
                        <div class="flex flex-col items-center">
                            <div class="w-full aspect-[4/5] bg-[#f8f8f8] flex items-center justify-center p-0 overflow-hidden rounded-sm">
                                <img src="${currentImg}" class="w-full h-full object-cover transition-all duration-300">
                            </div>

                            <!-- Thanh chuyển ảnh (< 1/7 >) -->
                            <div class="flex items-center justify-center gap-4 mt-5 border border-slate-200 rounded-full px-5 py-1.5 text-xs sm:text-sm text-slate-700 bg-white">
                                <button onclick="changeQuickAddImage(-1)" class="hover:text-black font-bold px-1 cursor-pointer">&lt;</button>
                                <span class="font-medium">${quickAddImageIdx + 1}/${images.length}</span>
                                <button onclick="changeQuickAddImage(1)" class="hover:text-black font-bold px-1 cursor-pointer">&gt;</button>
                            </div>
                        </div>

                        <!-- Khung Thông Tin Bên Phải -->
                        <div class="flex flex-col justify-between h-full space-y-4 text-xs sm:text-sm">
                            <div class="space-y-3">
                                <div>
                                    <span class="bg-[#f0f0f0] text-slate-600 px-2 py-0.5 text-[10px] font-bold inline-block mb-1.5">INSIDE</span>
                                    <h4 class="font-bold text-base text-slate-900 uppercase leading-snug">${p.name}</h4>
                                    <p class="text-slate-400 text-[11px] mt-0.5">SKU: ${typeof formatProductCode === 'function' ? formatProductCode(p.id, p.category) : p.id}</p>
                                </div>

                                <div class="flex items-baseline gap-2 pt-1">
                                    <span class="text-slate-400 line-through text-xs sm:text-sm">${origPriceFormatted} đ</span>
                                    <span class="bg-slate-100 text-slate-600 px-1.5 py-0.5 font-bold text-[10px]">-${discountPercent}%</span>
                                </div>
                                <p class="text-lg font-bold text-slate-900">${p.price.toLocaleString('vi-VN')} đ</p>

                                <div class="pt-2">
                                    <span class="text-slate-500 font-normal">Màu: <strong class="text-slate-800">${activeColor.name}</strong></span>
                                    <div class="flex gap-1 pt-1 items-center">${colorsHtml}</div>
                                </div>

                                <div class="pt-2">
                                    <div class="flex items-center gap-2 mb-2.5">
                                        <span class="text-slate-500 font-normal">Kích cỡ:</span>
                                        ${quickAddToCartSize ? `<strong class="text-slate-800 font-bold text-xs sm:text-sm">${quickAddToCartSize}</strong>` : ''}
                                        ${stockBadgeHtml}
                                    </div>
                                    <div class="flex gap-2 flex-wrap">${sizesHtml}</div>
                                </div>
                            </div>

                            <!-- Nút Thêm vào giỏ hàng -->
                            <div class="pt-6 mt-4">
                                <button onclick="submitQuickAddToCart()" ${isBtnDisabled ? 'disabled' : ''} class="w-full py-3.5 text-xs sm:text-sm uppercase tracking-wider transition ${btnClass}">
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    `;
}

function submitQuickAddToCart() {
    if (!quickAddToCartProduct || !quickAddToCartSize) return;

    const activeColor = quickAddToCartProduct.colors[quickAddToCartColorIdx] || quickAddToCartProduct.colors[0];

    const existingIndex = cartItems.findIndex(item =>
        item.productId === quickAddToCartProduct.id &&
        item.colorName === activeColor.name &&
        item.size === quickAddToCartSize
    );

    if (existingIndex > -1) {
        cartItems[existingIndex].quantity += 1;
    } else {
        cartItems.push({
            productId: quickAddToCartProduct.id,
            name: quickAddToCartProduct.name,
            price: quickAddToCartProduct.price,
            originalPrice: quickAddToCartProduct.originalPrice || Math.round(quickAddToCartProduct.price * 1.2),
            colorName: activeColor.name,
            image: activeColor.images[0],
            size: quickAddToCartSize,
            quantity: 1,
            category: quickAddToCartProduct.category || 'inside'
        });
    }

    closeQuickAddToCartModal();
    updateCartBadge();
    showCartToast(`Đã thêm ${quickAddToCartProduct.name} (Size ${quickAddToCartSize}) vào giỏ hàng`); // Giữ nguyên thông báo xanh
    // Đã bỏ openCartModal() để không chuyển hướng/mở giỏ hàng
}

// --- 7. HÀM HỖ TRỢ QUICK EDIT & ĐIỀU HƯỚNG ---

function findProductAnywhere(productId) {
    if (typeof originalProducts !== 'undefined') {
        const found = originalProducts.find(x => x.id === productId);
        if (found) return found;
    }

    const cartItem = cartItems.find(x => x.productId === productId);
    if (cartItem && cartItem.colorsData) {
        return {
            id: cartItem.productId,
            name: cartItem.name,
            price: cartItem.price,
            colors: cartItem.colorsData
        };
    }

    if (cartItem) {
        return {
            id: cartItem.productId,
            name: cartItem.name,
            price: cartItem.price,
            colors: [
                {
                    name: cartItem.colorName,
                    hex: "#000000",
                    images: [cartItem.image],
                    sizes: [
                        { name: "S", outOfStock: false },
                        { name: "M", outOfStock: false },
                        { name: "L", outOfStock: false },
                        { name: "XL", outOfStock: false }
                    ]
                }
            ]
        };
    }

    return null;
}

// Khai báo alias hàm renderQuickEditPanel để tránh lỗi Uncaught ReferenceError
function renderQuickEditPanel() {
    if (typeof renderQuickEditDrawer === 'function') {
        renderQuickEditDrawer();
    } else if (typeof renderQuickEditContent === 'function') {
        renderQuickEditContent();
    }
}

function openQuickEdit(idx) {
    toggleItemMenu(idx);
    editingCartItemIndex = idx;
    const item = cartItems[idx];
    if (!item) return;

    const p = findProductAnywhere(item.productId);
    if (!p) return;

    quickEditColorIdx = p.colors.findIndex(c => c.name === item.colorName);
    if (quickEditColorIdx === -1) quickEditColorIdx = 0;
    quickEditSelectedSize = item.size;

    renderQuickEditPanel(p, quickEditColorIdx);

    const drawer = document.getElementById('quick-edit-drawer');
    if (drawer) {
        drawer.classList.remove('hidden');
        setTimeout(() => {
            const overlay = document.getElementById('quick-edit-overlay');
            const panel = document.getElementById('quick-edit-panel');
            if (overlay) overlay.classList.remove('opacity-0');
            if (panel) panel.classList.remove('translate-x-full');
        }, 10);
    }
}

function selectQuickEditColor(colorIdx) {
    quickEditColorIdx = colorIdx;
    renderQuickEditDrawer();
}

function selectQuickEditSize(sizeName) {
    quickEditSelectedSize = sizeName;
    renderQuickEditDrawer();
}

function renderQuickEditDrawer() {
    const container = document.getElementById('quick-edit-drawer-body') || document.getElementById('quick-edit-panel');
    if (!container || editingCartItemIndex === null || !cartItems[editingCartItemIndex]) return;

    const item = cartItems[editingCartItemIndex];
    const product = typeof findProductAnywhere === 'function' 
        ? findProductAnywhere(item.productId) 
        : originalProducts.find(p => p.id === item.productId);

    if (!product) return;

    const currentColorIdx = (typeof quickEditColorIdx !== 'undefined' && quickEditColorIdx !== null) 
        ? quickEditColorIdx 
        : product.colors.findIndex(c => c.name === item.colorName);
        
    const activeColor = product.colors[currentColorIdx] || product.colors[0];
    const activeSize = (typeof quickEditSelectedSize !== 'undefined' && quickEditSelectedSize) 
        ? quickEditSelectedSize 
        : item.size;

    const origPriceFormatted = (product.originalPrice || Math.round(product.price * 1.2)).toLocaleString('vi-VN');
    const discountPercent = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 14;

    // Danh sách chọn màu
    const colorsHtml = product.colors.map((c, idx) => {
        const isSelected = idx === currentColorIdx;
        const ring = isSelected ? 'ring-2 ring-slate-900 ring-offset-2' : 'border-slate-300';
        return `<div class="p-1 shrink-0 flex items-center justify-center">
            <button onclick="selectQuickEditColor(${idx})" class="w-8 h-8 rounded-full border ${ring} transition cursor-pointer block" style="background-color: ${c.hex || '#000'};" title="${c.name}"></button>
        </div>`;
    }).join('');

    // Danh sách chọn Kích cỡ & Kiểm tra tồn kho
    const defaultSizes = [{ name: 'S', stock: 50 }, { name: 'M', stock: 15 }, { name: 'L', stock: 0 }, { name: 'XL', stock: 30 }, { name: 'XXL', stock: 40 }];
    const availableSizes = activeColor.sizes || defaultSizes;

    // Tìm đối tượng size đang chọn
    const selectedSizeObj = availableSizes.find(s => s.name === activeSize);
    let stockBadgeHtml = '';
    let isBtnDisabled = false;

    if (selectedSizeObj) {
        const isOutOfStock = selectedSizeObj.outOfStock || selectedSizeObj.stock === 0;
        const maxStock = selectedSizeObj.stock !== undefined ? selectedSizeObj.stock : (isOutOfStock ? 0 : 50);

        if (isOutOfStock || maxStock === 0) {
            stockBadgeHtml = `<span class="text-red-600 font-bold text-xs">Hết hàng</span>`;
            isBtnDisabled = true;
        } else if (item.quantity > maxStock) {
            stockBadgeHtml = `<span class="text-red-600 font-bold text-xs">Không đủ tồn kho (Còn ${maxStock})</span>`;
            isBtnDisabled = true;
        } else if (maxStock < 20) {
            stockBadgeHtml = `<span class="text-amber-600 font-bold text-xs">Sắp hết hàng</span>`;
            isBtnDisabled = false;
        } else {
            stockBadgeHtml = `<span class="text-emerald-600 font-bold text-xs"></span>`;
            isBtnDisabled = false;
        }
    }

    const btnClass = !isBtnDisabled
        ? "bg-[#222222] text-white hover:bg-black cursor-pointer font-bold"
        : "bg-[#cccccc] text-white cursor-not-allowed font-bold";

    const sizesHtml = availableSizes.map(s => {
        const isSelected = activeSize === s.name;
        const isOutOfStock = s.outOfStock || s.stock === 0;

        let style = '';
        if (isSelected) {
            style = 'bg-[#222222] text-white border-[#222222] font-bold';
        } else if (isOutOfStock) {
            style = 'bg-slate-50 text-slate-300 border-slate-200 font-normal';
        } else {
            style = 'bg-white text-slate-800 border-slate-200 hover:border-slate-400 font-medium';
        }

        return `<button onclick="selectQuickEditSize('${s.name}')" class="w-11 h-11 border text-xs sm:text-sm transition flex items-center justify-center cursor-pointer ${style}">${s.name}</button>`;
    }).join('');

    container.innerHTML = `
        <div class="bg-white w-full h-full min-h-screen flex flex-col justify-between">
            <div>
                <!-- Header Drawer -->
                <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 relative">
                    <button onclick="closeQuickEditDrawer()" class="text-slate-800 hover:text-black font-bold text-xl cursor-pointer p-1 z-10">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                    </button>
                    <h3 class="font-bold text-base text-slate-900 absolute inset-0 flex items-center justify-center pointer-events-none">ĐIỀU CHỈNH SẢN PHẨM</h3>
                    <button onclick="closeQuickEditDrawer()" class="text-slate-400 hover:text-black font-bold text-xl cursor-pointer p-1 z-10">&times;</button>
                </div>

                <!-- Body Content -->
                <div class="p-5 space-y-5">
                    <div class="flex gap-4 items-start">
                        <!-- Khung Ảnh sản phẩm (Ảnh to, p-0) -->
                        <div class="w-28 sm:w-32 aspect-[3/4] bg-[#f8f8f8] rounded-sm overflow-hidden shrink-0 flex items-center justify-center p-0">
                            <img src="${activeColor.images[0]}" class="w-full h-full object-cover">
                        </div>

                        <div class="space-y-1 flex-1 min-w-0">
                            <span class="bg-[#f0f0f0] text-slate-600 px-1.5 py-0.5 text-[10px] font-bold inline-block">ONOFF</span>
                            <h4 class="font-bold text-xs sm:text-sm text-slate-900 uppercase leading-snug line-clamp-2">${product.name}</h4>
                            <p class="text-slate-400 text-[11px]">SKU: ${typeof formatProductCode === 'function' ? formatProductCode(product.id, product.category) : product.id}</p>

                            <div class="flex items-baseline gap-2 pt-1">
                                <span class="text-slate-400 line-through text-xs">${origPriceFormatted} đ</span>
                                <span class="bg-slate-100 text-slate-600 px-1 py-0.2 font-bold text-[10px]">-${discountPercent}%</span>
                            </div>
                            <p class="text-base font-bold text-slate-900">${product.price.toLocaleString('vi-VN')} đ</p>
                        </div>
                    </div>

                    <!-- Chọn Màu sắc -->
                    <div class="pt-2">
                        <span class="text-slate-600 text-xs sm:text-sm">Màu sắc: <strong class="text-slate-900 font-bold">${activeColor.name}</strong></span>
                        <div class="flex gap-1.5 pt-2 items-center overflow-x-auto no-scrollbar">${colorsHtml}</div>
                    </div>

                    <!-- Chọn Kích cỡ & Thông báo Tồn kho -->
                    <div class="pt-2">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-slate-600 text-xs sm:text-sm">Kích cỡ:</span>
                            ${activeSize ? `<strong class="text-slate-900 font-bold text-xs sm:text-sm">${activeSize}</strong>` : ''}
                            ${stockBadgeHtml}
                        </div>
                        <div class="flex gap-2.5 pt-1 flex-wrap">${sizesHtml}</div>
                    </div>
                </div>
            </div>

            <!-- Footer: Nút Cập nhật giỏ hàng (Tự động disable nếu hết hàng) -->
            <div class="p-5 border-t border-slate-100 bg-white">
                <button onclick="saveQuickEdit()" ${isBtnDisabled ? 'disabled' : ''} class="w-full py-3.5 text-md uppercase tracking-widest transition ${btnClass}">
                    Cập nhật giỏ hàng
                </button>
            </div>
        </div>
    `;
}

function closeQuickEditDrawer() {
    const overlay = document.getElementById('quick-edit-overlay');
    const panel = document.getElementById('quick-edit-panel');
    const drawer = document.getElementById('quick-edit-drawer');
    if (overlay && panel && drawer) {
        overlay.classList.add('opacity-0');
        panel.classList.add('translate-x-full');
        setTimeout(() => drawer.classList.add('hidden'), 300);
    }
}

function saveQuickEdit() {
    if (editingCartItemIndex !== null && cartItems[editingCartItemIndex]) {
        const item = cartItems[editingCartItemIndex];
        const p = findProductAnywhere(item.productId);
        if (p) {
            const activeColor = p.colors[quickEditColorIdx] || p.colors[0];
            item.colorName = activeColor.name;
            item.image = activeColor.images[0];
            item.size = quickEditSelectedSize;
        }
    }
    closeQuickEditDrawer();
    updateCartBadge();
    renderCartModalContent();
    openCartModal();
}

function openProductDrawerFromCart(productId, colorName, category) {
    const cat = (category || 'inside').toLowerCase();
    const targetPage = getCategoryPageUrl(cat);

    const currentFileName = window.location.pathname.split('/').pop().toLowerCase();
    const targetFileName = targetPage.split('/').pop().toLowerCase();

    if (currentFileName !== targetFileName) {
        sessionStorage.setItem('auto_open_cart', 'true');
        const pCode = formatProductCode(productId, cat);

        let colorIdx = 0;
        const p = (typeof originalProducts !== 'undefined') ? originalProducts.find(x => x.id === productId) : null;
        if (p) {
            colorIdx = p.colors.findIndex(c => c.name === colorName);
            if (colorIdx === -1) colorIdx = 0;
        }

        const cCode = formatColorCode(colorIdx, cat);
        window.location.href = `${targetPage}?product=${pCode}&color=${cCode}`;
        return;
    }

    if (typeof originalProducts !== 'undefined') {
        const p = originalProducts.find(x => x.id === productId);
        if (!p) return;

        let colorIdx = p.colors.findIndex(c => c.name === colorName);
        if (colorIdx === -1) colorIdx = 0;

        if (typeof openProductDrawer === 'function') {
            openProductDrawer(productId, colorIdx, true);
        }
    }
}

// Tự động kích hoạt gán sự kiện hover khi trang load xong
document.addEventListener('DOMContentLoaded', () => {
    attachQuickAddHoverEvents();
});

(function injectQuickAddAnimationStyles() {
    if (document.getElementById('quick-add-animation-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'quick-add-animation-styles';
    style.innerHTML = `
        /* PC: Nhích nhẹ tại chỗ (Y-offset 24px -> 0) */
        @keyframes pcQuickAddPopIn {
            from { opacity: 0; transform: translateY(24px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pcQuickAddPopOut {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to { opacity: 0; transform: translateY(24px) scale(0.98); }
        }

        /* Mobile: Trượt hoàn toàn từ mép dưới màn hình lên */
        @keyframes mobileQuickAddSheetIn {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        @keyframes mobileQuickAddSheetOut {
            from { transform: translateY(0); }
            to { transform: translateY(100%); }
        }

        /* Classes áp dụng Animation theo mốc Responsive */
        .quick-add-anim-in {
            animation: mobileQuickAddSheetIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .quick-add-anim-out {
            animation: mobileQuickAddSheetOut 0.25s ease-in forwards;
        }

        @media (min-width: 640px) {
            .quick-add-anim-in {
                animation: pcQuickAddPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .quick-add-anim-out {
                animation: pcQuickAddPopOut 0.2s ease-in forwards;
            }
        }
    `;
    document.head.appendChild(style);
})();