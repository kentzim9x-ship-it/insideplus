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

const SHIPPING_CONFIG = {
    freeShippingThreshold: 499000,
    freeShippingMessage: "Bạn đã được miễn phí vận chuyển"
};

const availableVouchers = [
    { code: "EXTRA10", title: "Voucher 10%", desc: "[Voucher Extra] Giảm thêm 10% sản phẩm cho đơn từ 599K", discountType: "percent", discountValue: 10, minOrder: 599000, expiry: "2026-10-31" },
    { code: "GIAM50", title: "Voucher 50K", desc: "[Online] Voucher giảm 50K cho đơn hàng từ 599K", discountType: "fixed", discountValue: 50000, minOrder: 599000, expiry: "2026-10-31" },
    { code: "GIAM25", title: "Voucher 25K", desc: "[Online] Voucher giảm 25K cho đơn hàng từ 349K", discountType: "fixed", discountValue: 25000, minOrder: 349000, expiry: "2026-10-31" },
    { code: "GIAM100", title: "Voucher 100K", desc: "[Online] Voucher giảm 100K cho đơn hàng từ 549K", discountType: "fixed", discountValue: 100000, minOrder: 49000, expiry: "2026-10-31" }
];

let currentFilteredProducts = [...originalProducts];
let currentSelectedSize = null;
let currentGalleryImages = [];
let currentGalleryIndex = 0;
let cartItems = JSON.parse(localStorage.getItem('inside_cart') || '[]');
let currentQuantity = 1;
let editingCartItemIndex = null;
let quickEditSelectedSize = null;
let quickEditColorIdx = 0;
// ĐOẠN CODE ĐÃ THÊM/SỬA: Khởi tạo activeVoucher từ localStorage để lưu trạng thái giữa các trang
let activeVoucher = JSON.parse(localStorage.getItem('inside_active_voucher') || 'null');
let isSubtotalExpanded = false;

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
    // ĐOẠN CODE ĐÃ THÊM: Lưu giỏ hàng và voucher vào localStorage
    localStorage.setItem('inside_cart', JSON.stringify(cartItems));
    localStorage.setItem('inside_active_voucher', JSON.stringify(activeVoucher));
}

function openCartModal() {
    renderCartModalContent();
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('drawer-open'); // Thêm dòng này để khóa cuộn nền
        setTimeout(() => {
            document.getElementById('cart-overlay').classList.remove('opacity-0');
            document.getElementById('cart-panel').classList.remove('translate-x-full');
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
            document.body.classList.remove('drawer-open'); // Thêm dòng này để cho phép cuộn lại
        }, 300);
    }
}

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

function toggleSubtotalDetails() {
    isSubtotalExpanded = !isSubtotalExpanded;
    const box = document.getElementById('subtotal-details-box');
    const chevron = document.getElementById('subtotal-chevron-icon');
    if (box && chevron) {
        if (isSubtotalExpanded) {
            box.classList.remove('hidden');
            chevron.style.transform = 'rotate(180deg)';
        } else {
            box.classList.add('hidden');
            chevron.style.transform = 'rotate(0deg)';
        }
    }
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

// ĐOẠN CODE ĐÃ THÊM/SỬA: Xử lý điều hướng khi bấm vào sản phẩm trong giỏ hàng
function openProductDrawerFromCart(productId, colorName, category) {
    const cat = (category || 'inside').toLowerCase();
    const targetPage = getCategoryPageUrl(cat);

    // Lấy tên file HTML hiện tại (ví dụ: inside.html, sock.html, tshirt.html)
    const currentFileName = window.location.pathname.split('/').pop().toLowerCase();
    const targetFileName = targetPage.split('/').pop().toLowerCase();

    // 1. Kiểm tra nếu sản phẩm nằm ở TRANG KHÁC trang hiện tại
    if (currentFileName !== targetFileName) {
        // Tự động mở lại giỏ hàng sau khi chuyển trang
        sessionStorage.setItem('auto_open_cart', 'true');

        // Tạo mã URL chính xác (Product Code & Color Code)
        const pCode = formatProductCode(productId, cat);

        // Tìm colorIdx nếu sản phẩm có trong originalProducts, nếu không mặc định 0
        const p = originalProducts.find(x => x.id === productId);
        let colorIdx = 0;
        if (p) {
            colorIdx = p.colors.findIndex(c => c.name === colorName);
            if (colorIdx === -1) colorIdx = 0;
        }

        const cCode = formatColorCode(colorIdx, cat);

        // Chuyển hướng sang trang tương ứng (SOCK hoặc TSHIRT)
        window.location.href = `${targetPage}?product=${pCode}&color=${cCode}`;
        return;
    }

    // 2. Nếu sản phẩm NẰM CÙNG TRANG hiện tại
    const p = originalProducts.find(x => x.id === productId);
    if (!p) return;

    let colorIdx = p.colors.findIndex(c => c.name === colorName);
    if (colorIdx === -1) colorIdx = 0;

    // Hiển thị sản phẩm ở nền đằng sau mà không đóng giỏ hàng
    openProductDrawer(productId, colorIdx, true);
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

function updateCartItemQty(index, delta) {
    cartItems[index].quantity += delta;
    if (cartItems[index].quantity <= 0) {
        cartItems.splice(index, 1);
    }
    updateCartBadge();
    renderCartModalContent();
}

function removeCartItem(index) {
    cartItems.splice(index, 1);
    updateCartBadge();
    renderCartModalContent();
}

function handleCheckoutRedirect() {
    if (cartItems.length === 0) {
        alert('Giỏ hàng của bạn đang trống!');
        return;
    }
    window.location.href = 'https://checkout.example.com';
}

function changeQuantity(delta) {
    currentQuantity = Math.max(1, currentQuantity + delta);
    const qtyEl = document.getElementById('current-quantity-display');
    if (qtyEl) qtyEl.innerText = currentQuantity;
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
        colorsData: p.colors // Lưu dữ liệu đầy đủ của màu sắc & kích cỡ
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
            <img src="${item.image}" class="w-14 h-16 object-cover bg-slate-100">
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
    if (category === 'sock') return '../sock/sock.html';
    if (category === 'tshirt') return 'tshirt.html';
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
    const infoDrawer = document.getElementById('info-drawer');
    if (infoDrawer) {
        infoDrawer.classList.add('hidden');
        const infoOverlay = document.getElementById('info-overlay');
        const infoPanel = document.getElementById('info-panel');
        if (infoOverlay) infoOverlay.classList.add('opacity-0');
        if (infoPanel) infoPanel.classList.add('translate-x-full');
    }

    const introDrawer = document.getElementById('intro-drawer');
    if (introDrawer) {
        introDrawer.classList.add('hidden');
        const introOverlay = document.getElementById('intro-overlay');
        const introPanel = document.getElementById('intro-panel');
        if (introOverlay) introOverlay.classList.add('opacity-0');
        if (introPanel) introPanel.classList.add('translate-x-full');
    }

    const galleryModal = document.getElementById('gallery-modal');
    if (galleryModal) {
        galleryModal.classList.add('hidden');
    }

    const productDrawer = document.getElementById('product-drawer');
    if (productDrawer) {
        productDrawer.classList.remove('drawer-open');
    }
    document.body.classList.remove('drawer-open');

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

function openProductDrawer(id, colorIdx, shouldUpdateUrl) {
    const p = originalProducts.find(item => item.id === id);
    if (!p) return;

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

    const drawer = document.getElementById('product-drawer');
    if (drawer) {
        drawer.classList.remove('hidden');
    }

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

    // Render danh sách nút Size trong Xem chi tiết sản phẩm (Đã nâng size chữ & bỏ gạch chéo)
    const sizesHtml = availableSizes.map(s => {
        const isSelected = currentSelectedSize === s.name;
        
        // s.outOfStock: Màu xám nhạt, viền nhạt, KHÔNG gạch chéo chữ
        // isSelected: Màu đen, chữ trắng
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
                <button onclick="changeQuantity(-1)" class="px-2 text-sm font-bold text-slate-700 hover:text-black">-</button>
                <span id="current-quantity-display" class="px-3 text-sm font-bold text-slate-900">${currentQuantity}</span>
                <button onclick="changeQuantity(1)" class="px-2 text-sm font-bold text-slate-700 hover:text-black">+</button>
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

function closeProductDrawer(shouldUpdateUrl) {
    const drawer = document.getElementById('product-drawer');
    if (drawer) {
        drawer.classList.add('hidden');
        drawer.scrollTop = 0;
        drawer.classList.remove('drawer-open');
    }
    document.body.classList.remove('drawer-open');
    if (shouldUpdateUrl !== false) {
        updateProductUrlParam(null, null);
    }
    updateCartBadge();
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
        // 1. Kiểm tra nếu Quick Edit đang mở -> Đóng Quick Edit, giữ nguyên giỏ hàng
        const quickEditDrawer = document.getElementById('quick-edit-drawer');
        if (quickEditDrawer && !quickEditDrawer.classList.contains('hidden')) {
            closeQuickEditDrawer();
            return;
        }

        // 2. Nếu Voucher Drawer đang mở -> Đóng Voucher
        const voucherDrawer = document.getElementById('voucher-drawer');
        if (voucherDrawer && !voucherDrawer.classList.contains('hidden')) {
            closeVoucherDrawer();
            return;
        }

        // 3. Nếu Cart Modal đang mở -> Đóng Cart Modal
        const cartModal = document.getElementById('cart-modal');
        if (cartModal && !cartModal.classList.contains('hidden')) {
            closeCartModal();
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

    // Vuốt từ trái sang phải (deltaX > 60)
    if (deltaX > 60 && deltaX > deltaY) {
        // 1. Ưu tiên đóng Quick Edit Drawer trước nếu đang mở
        const quickEditDrawer = document.getElementById('quick-edit-drawer');
        if (quickEditDrawer && !quickEditDrawer.classList.contains('hidden')) {
            closeQuickEditDrawer();
            return;
        }

        // 2. Đóng Voucher Drawer nếu đang mở
        const voucherDrawer = document.getElementById('voucher-drawer');
        if (voucherDrawer && !voucherDrawer.classList.contains('hidden')) {
            closeVoucherDrawer();
            return;
        }

        // 3. Đóng Giỏ hàng nếu đang mở
        const cartModal = document.getElementById('cart-modal');
        if (cartModal && !cartModal.classList.contains('hidden')) {
            closeCartModal();
            return;
        }
    }

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
    // Thêm đoạn này vào cuối DOMContentLoaded của tất cả các file JS:
    if (sessionStorage.getItem('auto_open_cart') === 'true') {
        sessionStorage.removeItem('auto_open_cart');
        openCartModal(); // Tự động mở lại form giỏ hàng ngay khi tải trang mới!

        // Tự động mở lại bảng Điều chỉnh màu sắc, kích cỡ (Quick Edit) nếu có
        const pendingQuickEditIdx = sessionStorage.getItem('auto_open_quick_edit');
        if (pendingQuickEditIdx !== null) {
            sessionStorage.removeItem('auto_open_quick_edit');
            const idx = parseInt(pendingQuickEditIdx, 10);
            setTimeout(() => {
                openQuickEdit(idx);
            }, 350); // Chờ giỏ hàng render xong rồi mở panel chỉnh sửa
        }
    }

    renderVisualFilterBar();
    renderCatalog(originalProducts);
    updateCartBadge();
    checkAndOpenProductFromUrl();
});