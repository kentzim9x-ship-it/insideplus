const allSampleProducts = [
    {
        id: "inside-1",
        name: "Quần Lót Nam Seamless Không Đường May Brief",
        category: "INSIDE",
        path: "INSIDE/inside.html",
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1200"
    },
    {
        id: "inside-2",
        name: "Quần Lót Nam Sợi Tre Bamboo Premium Boxer",
        category: "INSIDE",
        path: "INSIDE/inside.html",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200"
    },
    {
        id: "sock-1",
        name: "Tất Cổ Ngắn Bamboo Kháng Khuẩn SlimFit",
        category: "SOCK",
        path: "SOCK/sock.html",
        image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&q=80&w=1200"
    },
    {
        id: "tshirt-1",
        name: "Áo Phông Nam Cotton Compact Premium T-Shirt",
        category: "TSHIRT",
        path: "TSHIRT/tshirt.html",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200"
    }
];

/* =========================================================
   HỆ THỐNG QUẢN LÝ GIỎ HÀNG (DÙNG CHO INDEX.JS)
   ========================================================= */

// Lấy dữ liệu Giỏ hàng & Voucher từ localStorage
let cartItems = JSON.parse(localStorage.getItem('inside_cart') || '[]');
let activeVoucher = JSON.parse(localStorage.getItem('inside_active_voucher') || 'null');
let editingCartItemIndex = null;
let quickEditSelectedSize = null;
let quickEditColorIdx = 0;

// Danh sách Voucher dùng chung
const availableVouchers = [
    { code: "EXTRA10", title: "Voucher 10%", desc: "[Voucher Extra] Giảm thêm 10% sản phẩm cho đơn từ 599K", discountType: "percent", discountValue: 10, minOrder: 599000, expiry: "2026-10-31" },
    { code: "GIAM50", title: "Voucher 50K", desc: "[Online] Voucher giảm 50K cho đơn hàng từ 599K", discountType: "fixed", discountValue: 50000, minOrder: 599000, expiry: "2026-10-31" },
    { code: "GIAM25", title: "Voucher 25K", desc: "[Online] Voucher giảm 25K cho đơn hàng từ 349K", discountType: "fixed", discountValue: 25000, minOrder: 349000, expiry: "2026-10-31" },
    { code: "GIAM100", title: "Voucher 100K", desc: "[Online] Voucher giảm 100K cho đơn hàng từ 549K", discountType: "fixed", discountValue: 100000, minOrder: 49000, expiry: "2026-10-31" }
];

const SHIPPING_CONFIG = {
    freeShippingThreshold: 499000,
    freeShippingMessage: "Bạn đã được miễn phí vận chuyển"
};

// 1. Đồng bộ Badge Giỏ hàng
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

// 2. Mở / Đóng Modal Giỏ hàng
function openCartModal() {
    renderCartModalContent();
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.documentElement.classList.add('drawer-open');
        document.body.classList.add('drawer-open');
        setTimeout(() => {
            document.getElementById('cart-overlay')?.classList.remove('opacity-0');
            document.getElementById('cart-panel')?.classList.remove('translate-x-full');
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
            document.documentElement.classList.remove('drawer-open');
            document.body.classList.remove('drawer-open');
        }, 300);
    }
}

// Helper lấy tiền tố mã SP
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

// Render nội dung Giỏ hàng
function renderCartModalContent() {
    const container = document.getElementById('cart-content-body');
    const totalPriceEl = document.getElementById('cart-total-price');
    const freeShipBanner = document.getElementById('free-ship-banner');
    const freeShipText = document.getElementById('free-ship-text');
    const subtotalEl = document.getElementById('summary-subtotal');
    const voucherDiscountRow = document.getElementById('voucher-discount-row');
    const voucherDiscountTitle = document.getElementById('voucher-discount-title');
    const summaryVoucherDiscount = document.getElementById('summary-voucher-discount');
    const voucherLabel = document.getElementById('selected-voucher-label');

    if (!container) return;

    if (cartItems.length === 0) {
        container.innerHTML = '<p class="text-center text-sm text-slate-400 font-bold uppercase tracking-wider py-16">Giỏ hàng của bạn đang trống.</p>';
        if (totalPriceEl) totalPriceEl.innerText = '0đ';
        if (freeShipBanner) freeShipBanner.classList.add('hidden');
        if (subtotalEl) subtotalEl.innerText = '0 đ';
        if (voucherDiscountRow) voucherDiscountRow.classList.add('hidden');
        return;
    }

    let rawSubtotal = 0;
    container.innerHTML = cartItems.map((item, idx) => {
        rawSubtotal += item.price * item.quantity;
        const codePrefix = formatProductCode(item.productId, item.category);
        const origPriceFormatted = (item.originalPrice ? item.originalPrice : Math.round(item.price * 1.2)).toLocaleString('vi-VN');
        const discountPercent = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 17;

        // ĐÃ ĐIỀU CHỈNH: Ảnh w-24 h-28, Chữ tiêu đề text-base, chữ chi tiết text-sm
        return `<div class="flex gap-5 p-5 border border-slate-100 bg-slate-50 items-center relative group">
            <img src="${item.image}" class="w-24 h-28 object-cover bg-slate-200 cursor-pointer shrink-0" onclick="openProductDrawerFromCart('${item.productId}', '${item.colorName}', '${item.category}')">
            <div class="flex-1 min-w-0 pr-6">
                <span class="text-[10px] font-black uppercase bg-slate-200 text-slate-800 px-2 py-0.5 tracking-wider">INSIDE+</span>
                <h4 class="font-black text-base uppercase text-slate-900 mt-1.5 cursor-pointer hover:underline truncate" onclick="openProductDrawerFromCart('${item.productId}', '${item.colorName}', '${item.category}')">${item.name}</h4>
                <p class="text-sm font-semibold text-slate-600 mt-1">${item.colorName} - ${codePrefix} | Size: <span class="font-black text-slate-900">${item.size}</span></p>
                
                <div class="flex items-baseline gap-2.5 mt-2">
                    <span class="text-sm text-slate-400 line-through">${origPriceFormatted} đ</span>
                    <span class="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 font-black">-${discountPercent}%</span>
                </div>
                
                <div class="flex items-center justify-between mt-4">
                    <span class="text-base font-black text-slate-900">${(item.price * item.quantity).toLocaleString('vi-VN')} đ</span>
                    <div class="flex items-center border border-slate-300 bg-white shadow-sm">
                        <button onclick="updateCartItemQty(${idx}, -1)" class="px-3 py-1.5 text-sm font-black text-slate-700 hover:bg-slate-100">-</button>
                        <span class="px-3 text-sm font-black text-slate-900">${item.quantity}</span>
                        <button onclick="updateCartItemQty(${idx}, 1)" class="px-3 py-1.5 text-sm font-black text-slate-700 hover:bg-slate-100">+</button>
                    </div>
                </div>
            </div>
            
            <div class="absolute top-4 right-4">
                <button onclick="toggleItemMenu(${idx})" class="p-1.5 text-slate-500 hover:text-black focus:outline-none">
                    <i data-lucide="more-vertical" class="w-5 h-5"></i>
                </button>
                <div id="item-menu-${idx}" class="absolute right-0 top-8 w-56 bg-white border border-slate-200 shadow-xl hidden z-20 py-2">
                    <button onclick="openQuickEdit(${idx})" class="w-full text-left px-4 py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 flex items-center gap-2.5">
                        <i data-lucide="sliders-horizontal" class="w-4 h-4"></i> Điều chỉnh màu sắc, kích cỡ
                    </button>
                    <button onclick="removeCartItem(${idx})" class="w-full text-left px-4 py-3 text-xs font-bold text-red-600 hover:bg-slate-50 flex items-center gap-2.5">
                        <i data-lucide="trash-2" class="w-4 h-4"></i> Xóa khỏi giỏ hàng
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');

    if (rawSubtotal >= SHIPPING_CONFIG.freeShippingThreshold) {
        if (freeShipBanner && freeShipText) {
            freeShipText.innerHTML = `<i data-lucide="truck" class="w-4 h-4 text-blue-800 inline mr-1"></i> ${SHIPPING_CONFIG.freeShippingMessage}`;
            freeShipBanner.classList.remove('hidden');
        }
    } else if (freeShipBanner) {
        freeShipBanner.classList.add('hidden');
    }

    let discountAmount = 0;
    if (activeVoucher) {
        if (rawSubtotal >= activeVoucher.minOrder) {
            discountAmount = activeVoucher.discountType === 'percent'
                ? Math.round((rawSubtotal * activeVoucher.discountValue) / 100)
                : activeVoucher.discountValue;
            if (voucherLabel) voucherLabel.innerText = activeVoucher.code;
        } else {
            activeVoucher = null;
            if (voucherLabel) voucherLabel.innerText = 'Chọn hoặc nhập mã';
        }
    } else if (voucherLabel) {
        voucherLabel.innerText = 'Chọn hoặc nhập mã';
    }

    const finalTotal = Math.max(0, rawSubtotal - discountAmount);
    if (subtotalEl) subtotalEl.innerText = rawSubtotal.toLocaleString('vi-VN') + ' đ';

    if (voucherDiscountRow && summaryVoucherDiscount && voucherDiscountTitle) {
        if (activeVoucher && discountAmount > 0) {
            voucherDiscountTitle.innerText = `${activeVoucher.code} đơn từ ${activeVoucher.minOrder.toLocaleString('vi-VN')}đ`;
            summaryVoucherDiscount.innerText = '-' + discountAmount.toLocaleString('vi-VN') + ' đ';
            voucherDiscountRow.classList.remove('hidden');
        } else {
            voucherDiscountRow.classList.add('hidden');
        }
    }

    if (totalPriceEl) totalPriceEl.innerText = finalTotal.toLocaleString('vi-VN') + 'đ';
    updateCartBadge();
    if (window.lucide) lucide.createIcons({ root: container });
}

// Xử lý Thao tác Tăng/Giảm/Xóa trong giỏ
function updateCartItemQty(index, delta) {
    cartItems[index].quantity += delta;
    if (cartItems[index].quantity <= 0) cartItems.splice(index, 1);
    updateCartBadge();
    renderCartModalContent();
}

function removeCartItem(index) {
    cartItems.splice(index, 1);
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

let isSubtotalExpanded = false;

function toggleSubtotalDetails() {
    isSubtotalExpanded = !isSubtotalExpanded;
    const box = document.getElementById('subtotal-details-box');
    const chevron = document.getElementById('subtotal-chevron-icon');
    if (box) {
        if (isSubtotalExpanded) {
            box.classList.remove('hidden');
            if (chevron) chevron.style.transform = 'rotate(180deg)';
        } else {
            box.classList.add('hidden');
            if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
    }
}

function openProductDrawerFromCart(productId, colorName, category) {
    const cat = (category || 'inside').toLowerCase();
    const targetPage = getCategoryPageUrl(cat);

    // Tự động mở lại giỏ hàng sau khi sang trang sản phẩm mới
    sessionStorage.setItem('auto_open_cart', 'true');

    // Tạo mã Product Code (SPI001, SPS001, SPT001)
    const pCode = formatProductCode(productId, cat);

    // Tìm colorIdx từ dữ liệu lưu trong giỏ hàng (nếu có)
    let colorIdx = 0;
    const cartItem = cartItems.find(x => x.productId === productId);
    if (cartItem && cartItem.colorsData) {
        colorIdx = cartItem.colorsData.findIndex(c => c.name === colorName);
        if (colorIdx === -1) colorIdx = 0;
    }

    const cCode = formatColorCode(colorIdx, cat);

    // Điều hướng trang nền sang chi tiết sản phẩm chuẩn
    window.location.href = `${targetPage}?product=${pCode}&color=${cCode}`;
}

function openVoucherDrawer() {
    renderVoucherList();
    const drawer = document.getElementById('voucher-drawer');
    if (drawer) {
        drawer.classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('voucher-overlay').classList.remove('opacity-0');
            document.getElementById('voucher-panel').classList.remove('translate-x-full');
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

        // Cấu hình Nút bấm
        let btnHtml = '';
        if (isSelected) {
            btnHtml = `<button onclick="selectVoucher('${v.code}')" class="px-4 py-2 bg-emerald-600 text-white text-xs font-black uppercase tracking-wider hover:bg-emerald-700 transition shadow">ĐÃ CHỌN ✓</button>`;
        } else if (canApply) {
            btnHtml = `<button onclick="selectVoucher('${v.code}')" class="px-4 py-2 bg-slate-950 text-white text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition">CHỌN MÃ</button>`;
        } else {
            btnHtml = `<button disabled class="px-3 py-2 bg-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider cursor-not-allowed">CHƯA ĐỦ ĐIỀU KIỆN</button>`;
        }

        // Cấu hình Khung nền & Viền khi được chọn vs chưa chọn
        const cardStyle = isSelected
            ? 'bg-emerald-50/60 border-2 border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
            : 'bg-white border border-slate-300 shadow-sm hover:border-slate-400';

        const tagStyle = isSelected 
            ? 'bg-emerald-600 text-white' 
            : 'bg-slate-100 text-slate-800';

        return `<div class="relative my-4 mx-1">
            <!-- Thẻ Voucher -->
            <div class="${cardStyle} p-4 transition-all duration-200">
                
                <!-- Hàng trên: Thông tin chi tiết -->
                <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="space-y-1">
                        <span class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${tagStyle}">VOUCHER CHÍNH HÃNG</span>
                        <h4 class="font-black text-sm uppercase text-slate-900 pt-1">${v.title}</h4>
                        <p class="text-xs text-slate-500 font-medium">${v.desc}</p>
                    </div>
                </div>
                
                <!-- Đường gạch đứt nét kiểu vé xem phim/coupon -->
                <div class="border-t-2 border-dashed border-slate-300 my-3 relative">
                    <!-- Vết bấm lỗ (Hình bán cầu) bên trái & phải -->
                    <div class="absolute -left-6 -top-2 w-4 h-4 bg-[#f8fafc] border-r border-slate-300 rounded-full"></div>
                    <div class="absolute -right-6 -top-2 w-4 h-4 bg-[#f8fafc] border-l border-slate-300 rounded-full"></div>
                </div>
                
                <!-- Hàng dưới: Mã & Nút hành động -->
                <div class="flex items-center justify-between pt-1">
                    <div>
                        <span class="block text-[9px] font-bold uppercase text-slate-400">MÃ GIẢM GIÁ</span>
                        <span class="text-sm font-mono font-black ${isSelected ? 'text-emerald-700' : 'text-slate-900'}">${v.code}</span>
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

// Bắt sự kiện gõ chữ vào ô input để mở khóa nút "ÁP DỤNG"
function handleManualVoucherInput() {
    const input = document.getElementById('manual-voucher-input');
    const btn = document.getElementById('btn-apply-manual-voucher');
    if (!input || !btn) return;

    if (input.value.trim().length > 0) {
        btn.disabled = false;
        btn.className = "px-6 py-3.5 bg-slate-950 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition cursor-pointer";
    } else {
        btn.disabled = true;
        btn.className = "px-6 py-3.5 bg-slate-200 text-slate-400 font-black text-xs uppercase tracking-widest cursor-not-allowed transition";
    }
}

// Áp dụng voucher khi nhấn nút
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

function toggleItemMenu(idx) {
    document.querySelectorAll('[id^="item-menu-"]').forEach((el, i) => {
        if (i !== idx) el.classList.add('hidden');
    });
    const menu = document.getElementById(`item-menu-${idx}`);
    if (menu) menu.classList.toggle('hidden');
}

// Hàm tìm sản phẩm trên toàn bộ dữ liệu (nếu có lưu trong localStorage hoặc từ cartItem)
function findProductAnywhere(productId) {
    // 1. Tìm trong danh sách trang hiện tại
    if (typeof originalProducts !== 'undefined') {
        const found = originalProducts.find(x => x.id === productId);
        if (found) return found;
    }

    // 2. Tìm trong danh sách cartItems (lấy từ colorsData đã lưu)
    const cartItem = cartItems.find(x => x.productId === productId);
    if (cartItem && cartItem.colorsData) {
        return {
            id: cartItem.productId,
            name: cartItem.name,
            price: cartItem.price,
            colors: cartItem.colorsData
        };
    }

    // 3. Fallback: Dùng dữ liệu cơ bản từ item trong giỏ hàng để khởi tạo khung Quick Edit
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

function getCategoryPageUrl(category) {
    const cat = (category || 'inside').toLowerCase();
    if (cat === 'sock') return 'SOCK/sock.html';
    if (cat === 'tshirt') return 'TSHIRT/tshirt.html';
    return 'INSIDE/inside.html';
}

function handleCheckoutRedirect() {
    if (cartItems.length === 0) {
        alert('Giỏ hàng của bạn đang trống!');
        return;
    }
    window.location.href = 'https://checkout.example.com';
}

function openQuickEdit(idx) {
    toggleItemMenu(idx);
    editingCartItemIndex = idx;
    const item = cartItems[idx];
    if (!item) return;

    // Tìm sản phẩm từ bất kỳ nguồn dữ liệu nào (không phụ thuộc vào trang hiện tại)
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
            document.getElementById('quick-edit-overlay').classList.remove('opacity-0');
            document.getElementById('quick-edit-panel').classList.remove('translate-x-full');
        }, 10);
    }
}

function selectQuickEditSize(sizeName, productId, colorIdx) {
    quickEditSelectedSize = sizeName;
    const p = findProductAnywhere(productId);
    if (p) {
        renderQuickEditPanel(p, colorIdx);
    }
}

function renderQuickEditPanel(p, colorIdx) {
    quickEditColorIdx = colorIdx;
    const activeColor = p.colors[colorIdx] || p.colors[0];
    const availableSizes = activeColor.sizes || [];

    // Tự động chọn size đầu tiên còn hàng nếu chưa có size được chọn
    if (!quickEditSelectedSize || !availableSizes.some(s => s.name === quickEditSelectedSize)) {
        const firstAvail = availableSizes.find(s => !s.outOfStock);
        if (firstAvail) {
            quickEditSelectedSize = firstAvail.name;
        } else if (availableSizes.length > 0) {
            quickEditSelectedSize = availableSizes[0].name;
        }
    }

    // Kiểm tra xem size hiện tại đang chọn có hết hàng hay không
    const selectedSizeObj = availableSizes.find(s => s.name === quickEditSelectedSize);
    const isOutOfStock = selectedSizeObj ? selectedSizeObj.outOfStock : false;

    // Render nút danh sách màu sắc
    const colorsHtml = p.colors.map((c, cIdx) => {
        const activeClass = cIdx === colorIdx ? 'ring-2 ring-slate-900 ring-offset-2' : '';
        return `<button type="button" onclick="renderQuickEditPanel(findProductAnywhere('${p.id}'), ${cIdx})" class="w-7 h-7 rounded-full border border-slate-300 relative ${activeClass}" style="background-color: ${c.hex};" title="${c.name}"></button>`;
    }).join('');

    // Render danh sách nút size (Đổi sang gọi selectQuickEditSize để luôn bấm linh hoạt)
    const sizesHtml = availableSizes.map(s => {
        const isSelected = quickEditSelectedSize === s.name;

        // Đã chỉnh: Nâng text-xs -> text-sm font-black, đổi ring-red-400 -> ring-2 ring-slate-900 (viền đen)
        const btnStyle = s.outOfStock
            ? (isSelected
                ? 'bg-slate-100 text-slate-400 border-slate-900 ring-2 ring-slate-900 line-through-thick'
                : 'bg-slate-100 text-slate-300 border-slate-200 line-through-thick')
            : (isSelected
                ? 'bg-slate-950 text-white border-slate-950'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-900');

        return `<button type="button" onclick="selectQuickEditSize('${s.name}', '${p.id}', ${colorIdx})" class="w-12 h-12 border text-sm font-black transition flex items-center justify-center cursor-pointer ${btnStyle}">${s.name}</button>`;
    }).join('');

    // Render thông tin vào thân drawer
    const body = document.getElementById('quick-edit-body');
    if (body) {
        body.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="aspect-[4/5] bg-slate-100 overflow-hidden">
                <img src="${activeColor.images[0]}" class="w-full h-full object-cover">
            </div>
            <div class="space-y-4">
                <span class="text-[10px] font-bold uppercase bg-slate-100 px-2 py-0.5 text-slate-700">ONOFF</span>
                <h4 class="text-xl font-black uppercase text-slate-900">${p.name}</h4>
                <div class="flex items-baseline gap-3">
                    <span class="text-xl font-black text-slate-900">${p.price.toLocaleString('vi-VN')} đ</span>
                </div>
                <div class="space-y-1.5 pt-2">
                    <span class="text-xs font-bold uppercase text-slate-700">Màu sắc: <span class="font-black">${activeColor.name}</span></span>
                    <div class="flex gap-2">${colorsHtml}</div>
                </div>
                <div class="space-y-1.5 pt-2">
                    <span class="text-xs font-bold uppercase text-slate-700">Kích cỡ: <span class="font-black">${quickEditSelectedSize}</span></span>
                    <div class="flex gap-2 flex-wrap">${sizesHtml}</div>
                </div>
            </div>
        </div>`;
        if (window.lucide) lucide.createIcons({ root: body });
    }

    // ĐIỀU KHIỂN TRỰC TIẾP NÚT "CẬP NHẬT GIỎ HÀNG" CÓ SẴN Ở FOOTER CỦA HTML
    const btnSubmit = document.querySelector('#quick-edit-panel .border-t button');
    if (btnSubmit) {
        if (isOutOfStock) {
            btnSubmit.disabled = true;
            btnSubmit.className = "w-full bg-slate-300 text-slate-500 py-4 font-bold text-xs uppercase tracking-widest cursor-not-allowed transition";
        } else {
            btnSubmit.disabled = false;
            btnSubmit.className = "w-full bg-slate-950 text-white py-4 font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition cursor-pointer";
        }
    }
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

// Bổ sung hàm hỗ trợ lấy dữ liệu sản phẩm chuẩn cho QuickEdit
function getQuickEditProductData(productId) {
    let p = originalProducts.find(x => x.id === productId);
    if (!p && editingCartItemIndex !== null && cartItems[editingCartItemIndex]) {
        const item = cartItems[editingCartItemIndex];
        p = {
            id: item.productId,
            name: item.name,
            price: item.price,
            colors: item.colorsData
        };
    }
    return p;
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
            // Vuốt màn hình lên trên (Scroll Up) -> Ẩn thanh menu
            bottomNav.classList.add('nav-hidden');
        } else if (currentScroll > lastScrollTop) {
            // Vuốt màn hình xuống dưới (Scroll Down) -> Hiện thanh menu
            bottomNav.classList.remove('nav-hidden');
        }

        // Đứng yên không thao tác quá 150ms -> Hiện thanh menu
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
            clearAllBoldActiveStates(); // Xóa trạng thái active khi đóng drawer
        }, 300);
    }
}

let savedScrollPositionY = 0;

function openSearchModal() {
    const searchModal = document.getElementById('search-modal');
    if (!searchModal) return;

    savedScrollPositionY = window.scrollY;

    searchModal.classList.remove('hidden');
    searchModal.scrollTop = 0;

    // Thêm drawer-open cho cả html và body
    document.documentElement.classList.add('drawer-open');
    document.body.classList.add('drawer-open');

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

    // Gỡ drawer-open khỏi html và body
    document.documentElement.classList.remove('drawer-open');
    document.body.classList.remove('drawer-open');
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
}

function handleSearchInput(query) {
    const titleEl = document.getElementById('search-results-title');
    const clearBtn = document.getElementById('btn-clear-history');
    const container = document.getElementById('viewed-products-container');

    if (!query.trim()) {
        titleEl.innerHTML = `<i data-lucide="history" class="w-4 h-4 text-slate-400"></i> Sản phẩm đã xem`;
        clearBtn.classList.remove('hidden');
        renderViewedProducts();
        return;
    }

    titleEl.innerHTML = `<i data-lucide="search" class="w-4 h-4 text-slate-400"></i> Kết quả tìm kiếm cho "${query}"`;
    clearBtn.classList.add('hidden');

    const matches = allSampleProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    if (matches.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-xs text-slate-400 font-bold uppercase tracking-wider py-8">Không tìm thấy sản phẩm nào.</p>`;
        return;
    }

    container.innerHTML = matches.map(p => `
        <div class="group cursor-pointer" onclick="window.location.href='${p.path}'">
            <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden border border-slate-100">
                <img src="${p.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                <span class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-widest text-slate-900 px-2 py-0.5">${p.category}</span>
            </div>
        </div>
    `).join('');
    if (window.lucide) lucide.createIcons();
}

function renderViewedProducts() {
    const viewed = JSON.parse(localStorage.getItem('viewed_products') || '[]');
    const container = document.getElementById('viewed-products-container');
    if (!container) return;

    if (viewed.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-xs text-slate-400 font-bold uppercase tracking-wider py-8">Bạn chưa xem sản phẩm nào gần đây.</p>`;
        return;
    }

    container.innerHTML = viewed.map(p => {
        let path = `${p.category.toUpperCase()}/${p.category.toLowerCase()}.html`;
        return `
        <div class="group cursor-pointer" onclick="window.location.href='${path}'">
            <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden border border-slate-100">
                <img src="${p.images ? p.images[0] : p.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                <span class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-widest text-slate-900 px-2 py-0.5">${p.category}</span>
            </div>
        </div>
    `}).join('');
    if (window.lucide) lucide.createIcons();
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
    updateCartBadge(); // Gọi hàm đồng bộ giỏ hàng
    // Thêm đoạn này vào cuối DOMContentLoaded của tất cả các file JS:
    if (sessionStorage.getItem('auto_open_cart') === 'true') {
        sessionStorage.removeItem('auto_open_cart');
        openCartModal(); // Tự động mở lại form giỏ hàng ngay khi tải trang mới!
    }
});

// 5. CẬP NHẬT LẮNG NGHE SỰ KIỆN ESC VÀ VUỐT MOBILE
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
        const quickEditDrawer = document.getElementById('quick-edit-drawer');
        if (quickEditDrawer && !quickEditDrawer.classList.contains('hidden')) {
            closeQuickEditDrawer();
            return;
        }
        const voucherDrawer = document.getElementById('voucher-drawer');
        if (voucherDrawer && !voucherDrawer.classList.contains('hidden')) {
            closeVoucherDrawer();
            return;
        }
        const cartModal = document.getElementById('cart-modal');
        if (cartModal && !cartModal.classList.contains('hidden')) {
            closeCartModal();
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

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);

    if (deltaX > 60 && deltaX > deltaY) {
        const quickEditDrawer = document.getElementById('quick-edit-drawer');
        if (quickEditDrawer && !quickEditDrawer.classList.contains('hidden')) {
            closeQuickEditDrawer();
            return;
        }
        const voucherDrawer = document.getElementById('voucher-drawer');
        if (voucherDrawer && !voucherDrawer.classList.contains('hidden')) {
            closeVoucherDrawer();
            return;
        }
        const cartModal = document.getElementById('cart-modal');
        if (cartModal && !cartModal.classList.contains('hidden')) {
            closeCartModal();
            return;
        }
    }
}, { passive: true });