const CHECKOUT_SESSION_KEY = 'inside_checkout_form_data';

// 1. HÀM ĐÓNG GÓI DỮ LIỆU ĐƠN HÀNG CHUẨN
function buildOrderPayload() {
    const paymentMethodEl = document.querySelector('input[name="payment_method"]:checked');
    const paymentMethod = paymentMethodEl ? paymentMethodEl.value : 'COD'; // COD hoặc BANK_TRANSFER
    
    const cartItems = JSON.parse(localStorage.getItem('inside_cart') || '[]');
    const activeVoucher = JSON.parse(localStorage.getItem('inside_active_voucher') || 'null');

    const provinceSelect = document.getElementById('province');
    const wardSelect = document.getElementById('ward');
    const provinceName = provinceSelect && provinceSelect.selectedIndex >= 0 ? provinceSelect.options[provinceSelect.selectedIndex].text : '';
    const wardName = wardSelect && wardSelect.selectedIndex >= 0 ? wardSelect.options[wardSelect.selectedIndex].text : '';
    const detailAddress = document.getElementById('address')?.value.trim() || '';

    // Tính tổng thanh toán thực tế
    const finalTotalEl = document.getElementById('summary-final-total');
    const finalTotalText = finalTotalEl ? finalTotalEl.innerText.replace(/[^0-9]/g, '') : '0';

    return {
        customer: {
            fullName: document.getElementById('fullname')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            email: document.getElementById('email')?.value.trim() || '',
            address: detailAddress,
            province: provinceName,
            ward: wardName,
            fullAddress: `${detailAddress}, ${wardName}, ${provinceName}`
        },
        payment: {
            method: paymentMethod,
            status: paymentMethod === 'COD' ? 'PENDING' : 'AWAITING_PAYMENT'
        },
        items: cartItems.map(item => ({
            productId: item.productId || 'SKU_UNKNOWN',
            name: item.name,
            color: item.colorName || 'Đen',
            size: item.size || 'S',
            quantity: item.quantity,
            price: item.price,
            image: item.image,
            totalPrice: item.price * item.quantity
        })),
        voucher: activeVoucher ? activeVoucher.code : null,
        totalAmount: parseInt(finalTotalText, 10) || 0
    };
}

// 2. HÀM XỬ LÝ KHI BẤM THANH TOÁN
async function handlePlaceOrder(e) {
    if (e) e.preventDefault();

    const submitBtn = document.getElementById('btn-submit-order');
    const originalBtnText = submitBtn ? submitBtn.innerText : 'Thanh toán';

    try {
        // Hiển thị trạng thái Loading
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = 'ĐANG XỬ LÝ...';
        }

        // Đóng gói dữ liệu đơn hàng
        const orderPayload = buildOrderPayload();

        // Gửi qua OrderService lên Google Apps Script
        const result = await OrderService.createOrder(orderPayload);

        if (result && result.success) {
            // Gắn orderId vừa sinh vào payload và lưu vào localStorage để trang order-success hiển thị
            orderPayload.orderId = result.orderId;
            localStorage.setItem('inside_last_order', JSON.stringify(orderPayload));

            // Xóa sạch giỏ hàng và dữ liệu đệm phiên thanh toán
            localStorage.removeItem('inside_cart');
            localStorage.removeItem('inside_active_voucher');
            sessionStorage.removeItem(CHECKOUT_SESSION_KEY);

            // Điều hướng dựa theo phương thức thanh toán
            if (orderPayload.payment.method === 'BANK_TRANSFER') {
                window.location.href = `payment-qr.html?orderId=${result.orderId}`;
            } else {
                window.location.href = `order-success.html?orderId=${result.orderId}`;
            }
        } else {
            alert('Có lỗi xảy ra trong quá trình lưu đơn hàng: ' + (result.error || 'Vui lòng thử lại!'));
        }
    } catch (err) {
        console.error('Lỗi khi đặt hàng:', err);
        alert('Không thể kết nối đến máy chủ xử lý đơn hàng. Vui lòng kiểm tra lại kết nối mạng!');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    }
}

// 3. HÀM LƯU DỮ LIỆU FORM
function saveCheckoutSession() {
    const formData = {
        fullname: document.getElementById('fullname')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        email: document.getElementById('email')?.value || '',
        province: document.getElementById('province')?.value || '',
        ward: document.getElementById('ward')?.value || '',
        address: document.getElementById('address')?.value || '',
        note: document.getElementById('note')?.value || ''
    };
    sessionStorage.setItem(CHECKOUT_SESSION_KEY, JSON.stringify(formData));
}

// 4. HÀM KHÔI PHÚC DỮ LIỆU TỪ SESSION STORAGE
function loadCheckoutSession() {
    const savedData = sessionStorage.getItem(CHECKOUT_SESSION_KEY);
    if (!savedData) return;

    try {
        const formData = JSON.parse(savedData);

        if (formData.fullname && document.getElementById('fullname'))
            document.getElementById('fullname').value = formData.fullname;

        if (formData.phone && document.getElementById('phone'))
            document.getElementById('phone').value = formData.phone;

        if (formData.email && document.getElementById('email'))
            document.getElementById('email').value = formData.email;

        if (formData.address && document.getElementById('address'))
            document.getElementById('address').value = formData.address;

        if (formData.note && document.getElementById('note'))
            document.getElementById('note').value = formData.note;

        if (formData.province && document.getElementById('province')) {
            document.getElementById('province').value = formData.province;
            onProvinceChange(false);

            if (formData.ward && document.getElementById('ward')) {
                document.getElementById('ward').value = formData.ward;
            }
        }

        validateShippingForm();
    } catch (err) {
        console.error("Lỗi khi khôi phục session checkout:", err);
    }
}

// 5. ĐẮNG KÝ LẮNG NGHE SỰ KIỆN NHẬP LIỆU
function attachSessionInputListeners() {
    const fieldIds = ['fullname', 'phone', 'email', 'address', 'note'];
    fieldIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                saveCheckoutSession();
                validateShippingForm();
            });
        }
    });

    const wardSelect = document.getElementById('ward');
    if (wardSelect) {
        wardSelect.addEventListener('change', () => {
            saveCheckoutSession();
            validateShippingForm();
        });
    }
}

// 6. CHECK DỮ LIỆU BẮT BUỘC
function validateShippingForm() {
    const fullname = document.getElementById('fullname')?.value.trim() || '';
    const phone = document.getElementById('phone')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const province = document.getElementById('province')?.value || '';
    const ward = document.getElementById('ward')?.value || '';
    const address = document.getElementById('address')?.value.trim() || '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = email !== '' && emailRegex.test(email);

    const isValid = fullname !== '' && phone !== '' && isEmailValid && province !== '' && ward !== '' && address !== '';

    const paymentBlock = document.getElementById('payment-methods-block');
    const submitBtn = document.getElementById('btn-submit-order');

    if (paymentBlock && submitBtn) {
        if (isValid) {
            paymentBlock.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.className = "w-full py-4 bg-[#0f172a] text-white font-bold text-sm tracking-wider uppercase hover:bg-black transition cursor-pointer text-center block rounded-none";
        } else {
            paymentBlock.classList.add('hidden');
            submitBtn.disabled = true;
            submitBtn.className = "w-full py-4 bg-[#b0b0b0] text-white font-bold text-sm tracking-wider uppercase transition cursor-not-allowed text-center block rounded-none";
        }
    }
}

let isDetailsExpanded = true;
let provincesData = [];

// API LẤY TỈNH/THÀNH VÀ PHƯỜNG/XÃ
async function fetchProvinces() {
    try {
        const response = await fetch('https://provinces.open-api.vn/api/?depth=3');
        provincesData = await response.json();
        const provinceSelect = document.getElementById('province');
        if (!provinceSelect) return;

        provinceSelect.innerHTML = '<option value="">Tỉnh / Thành phố</option>';
        provincesData.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.code;
            opt.textContent = p.name;
            provinceSelect.appendChild(opt);
        });

        loadCheckoutSession();
    } catch (err) {
        console.error("Không lấy được dữ liệu hành chính:", err);
    }
}

function onProvinceChange(resetWard = true) {
    const provinceSelect = document.getElementById('province');
    if (!provinceSelect) return;

    const provinceCode = provinceSelect.value;
    const wardSelect = document.getElementById('ward');
    if (!wardSelect) return;

    wardSelect.innerHTML = '<option value="">Phường / Xã</option>';

    if (provinceCode) {
        const selectedProv = provincesData.find(p => p.code == provinceCode);
        if (selectedProv && selectedProv.districts) {
            let allWards = [];
            selectedProv.districts.forEach(d => {
                if (d.wards) allWards = allWards.concat(d.wards);
            });

            allWards.forEach(w => {
                const opt = document.createElement('option');
                opt.value = w.code;
                opt.textContent = w.name;
                wardSelect.appendChild(opt);
            });
        }
    }

    if (resetWard) {
        saveCheckoutSession();
    }
    validateShippingForm();
}

function handleVoucherInput() {
    const input = document.getElementById('voucher-input');
    const btn = document.getElementById('btn-apply-voucher');
    if (!input || !btn) return;

    if (input.value.trim().length > 0) {
        btn.classList.add('btn-voucher-active');
    } else {
        btn.classList.remove('btn-voucher-active');
    }
}

function toggleProductDetails() {
    isDetailsExpanded = !isDetailsExpanded;
    const detailsDiv = document.getElementById('checkout-product-details');
    const btnToggle = document.getElementById('btn-toggle-details');

    if (isDetailsExpanded) {
        detailsDiv.classList.remove('hidden');
        btnToggle.innerText = 'Thu gọn';
    } else {
        detailsDiv.classList.add('hidden');
        btnToggle.innerText = 'Chi tiết';
    }
}

function openVoucherModal() {
    renderVoucherModalList();
    const modal = document.getElementById('voucher-modal');
    const panel = document.getElementById('voucher-panel');

    if (modal && panel) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.classList.add('overflow-hidden');

        if (window.innerWidth < 640) {
            setTimeout(() => {
                panel.classList.remove('translate-x-full');
                panel.classList.add('translate-x-0');
            }, 10);
        } else {
            setTimeout(() => {
                modal.classList.add('voucher-pc-open');
            }, 10);
        }
    }
}

function closeVoucherModal() {
    const modal = document.getElementById('voucher-modal');
    const panel = document.getElementById('voucher-panel');

    if (modal && panel) {
        if (window.innerWidth < 640) {
            panel.classList.remove('translate-x-0');
            panel.classList.add('translate-x-full');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.classList.remove('overflow-hidden');
            }, 300);
        } else {
            modal.classList.remove('voucher-pc-open');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.classList.remove('overflow-hidden');
            }, 200);
        }
    }
}

function renderVoucherModalList() {
    const container = document.getElementById('voucher-list-container');
    if (!container) return;

    const voucherList = (typeof availableVouchers !== 'undefined') ? availableVouchers : [];
    const cartItems = JSON.parse(localStorage.getItem('inside_cart') || '[]');
    const activeVoucher = JSON.parse(localStorage.getItem('inside_active_voucher') || 'null');

    const rawSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (voucherList.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 text-center py-8">Chưa có mã giảm giá nào.</p>';
        return;
    }

    container.innerHTML = voucherList.map(v => {
        const isEligible = rawSubtotal >= v.minOrder;
        const isSelected = activeVoucher && activeVoucher.code === v.code;

        let borderStyle = 'border border-slate-200 bg-white';
        let badgeStyle = 'bg-[#f1f5f9] text-[#475569]';
        let btnHtml = '';

        if (isSelected) {
            borderStyle = 'border-2 border-[#059669] bg-[#f0fdf4] voucher-card-selected';
            badgeStyle = 'bg-[#059669] text-white';
            btnHtml = `<button type="button" onclick="selectVoucherFromModal('${v.code}')" class="px-3.5 py-1.5 bg-[#059669] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs cursor-pointer">ĐÃ CHỌN ✓</button>`;
        } else if (isEligible) {
            badgeStyle = 'bg-[#059669] text-white';
            btnHtml = `<button type="button" onclick="selectVoucherFromModal('${v.code}')" class="px-3.5 py-1.5 bg-[#0f172a] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition cursor-pointer">CHỌN MÃ</button>`;
        } else {
            btnHtml = `<button type="button" disabled class="px-3 py-1.5 bg-[#f1f5f9] text-[#94a3b8] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider cursor-not-allowed">CHƯA ĐỦ ĐIỀU KIỆN</button>`;
        }

        return `
            <div class="relative ${borderStyle} transition-all duration-200">
                <div class="p-3.5 sm:p-4 space-y-1">
                    <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none inline-block ${badgeStyle}">
                        VOUCHER CHÍNH HÃNG
                    </span>
                    <h4 class="font-bold text-sm sm:text-base text-slate-900 uppercase pt-1">${v.title || v.code}</h4>
                    <p class="text-xs text-slate-500">${v.desc || ('Đơn hàng tối thiểu ' + v.minOrder.toLocaleString('vi-VN') + 'đ')}</p>
                </div>

                <div class="relative border-t border-dashed border-slate-300 my-1">
                    <div class="voucher-card-notch-left"></div>
                    <div class="voucher-card-notch-right"></div>
                </div>

                <div class="p-3.5 sm:p-4 flex justify-between items-center">
                    <div>
                        <span class="block text-[9px] font-bold text-slate-400 uppercase">MÃ GIẢM GIÁ</span>
                        <span class="font-mono font-bold text-sm sm:text-base text-slate-900">${v.code}</span>
                    </div>
                    <div>${btnHtml}</div>
                </div>
            </div>
        `;
    }).join('');
}

function selectVoucherFromModal(code) {
    const voucherList = (typeof availableVouchers !== 'undefined') ? availableVouchers : [];
    const v = voucherList.find(item => item.code === code);
    let activeVoucher = JSON.parse(localStorage.getItem('inside_active_voucher') || 'null');

    if (v) {
        if (activeVoucher && activeVoucher.code === v.code) {
            activeVoucher = null;
            localStorage.removeItem('inside_active_voucher');
        } else {
            activeVoucher = v;
            localStorage.setItem('inside_active_voucher', JSON.stringify(v));
        }
        renderCheckoutSummary();
        renderVoucherModalList();
    }
}

function applyModalInputVoucher() {
    const input = document.getElementById('voucher-modal-input');
    if (!input) return;
    const inputVal = input.value.trim().toUpperCase();
    if (!inputVal) return;

    const voucherList = (typeof availableVouchers !== 'undefined') ? availableVouchers : [];
    const found = voucherList.find(v => v.code.toUpperCase() === inputVal);

    if (found) {
        selectVoucherFromModal(found.code);
        input.value = '';
    } else {
        alert('Mã giảm giá không tồn tại!');
    }
}

function applyManualVoucherCheckout() {
    const input = document.getElementById('voucher-input');
    if (!input) return;
    const inputVal = input.value.trim().toUpperCase();
    if (!inputVal) return;

    const voucherList = (typeof availableVouchers !== 'undefined') ? availableVouchers : [];
    const found = voucherList.find(v => v.code.toUpperCase() === inputVal);

    if (found) {
        selectVoucherFromModal(found.code);
    } else {
        alert('Mã giảm giá không tồn tại hoặc đã hết hạn!');
    }
}

/* RENDER TỔNG QUAN ĐƠN HÀNG */
function renderCheckoutSummary() {
    const cartItems = JSON.parse(localStorage.getItem('inside_cart') || '[]');
    const activeVoucher = JSON.parse(localStorage.getItem('inside_active_voucher') || 'null');

    const detailsDiv = document.getElementById('checkout-product-details');
    const totalCountEl = document.getElementById('summary-total-count');
    const subtotalEl = document.getElementById('summary-subtotal');
    const finalTotalEl = document.getElementById('summary-final-total');
    const shippingFeeEl = document.getElementById('summary-shipping-fee');
    const voucherTagEl = document.getElementById('applied-voucher-tag');
    const voucherCodeTextEl = document.getElementById('applied-voucher-code-text');
    const discountBreakdownList = document.getElementById('discount-breakdown-list');

    if (!cartItems || cartItems.length === 0) {
        alert('Giỏ hàng trống!');
        window.location.href = '../index.html';
        return;
    }

    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (totalCountEl) totalCountEl.innerText = totalQty;

    let originalSubtotal = 0;
    let directDiscount = 0;

    detailsDiv.innerHTML = cartItems.map(item => {
        const itemOrigPrice = item.originalPrice || Math.round(item.price * 1.2);
        originalSubtotal += itemOrigPrice * item.quantity;
        directDiscount += (itemOrigPrice - item.price) * item.quantity;

        const discountPercent = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 14;

        return `
            <div class="flex gap-3.5 items-center py-2.5 border-b border-slate-50 last:border-0">
                <div class="w-16 h-16 bg-[#f8f8f8] rounded-none overflow-hidden shrink-0 p-0">
                    <img src="${item.image}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 min-w-0 text-xs">
                    <span class="bg-[#f0f0f0] text-slate-600 px-1 py-0.2 text-[9px] font-bold inline-block">INSIDE⁺</span>
                    <h4 class="font-bold text-slate-900 truncate">${item.name}</h4>
                    <p class="text-slate-400 text-[11px]">${item.colorName || 'Đen'} - ${item.productId || 'SK001'} | ${item.size || 'S'}</p>
                    <div class="flex items-center gap-2 pt-0.5">
                        <span class="font-bold text-slate-900">${(item.price * item.quantity).toLocaleString('vi-VN')} đ</span>
                        <span class="text-slate-400 line-through text-[11px]">${(itemOrigPrice * item.quantity).toLocaleString('vi-VN')} đ</span>
                        <span class="bg-slate-100 text-slate-600 px-1 text-[9px] font-bold">-${discountPercent}%</span>
                    </div>
                </div>
                <span class="font-bold text-xs text-slate-800 shrink-0">x ${item.quantity}</span>
            </div>
        `;
    }).join('');

    const currentPriceTotal = originalSubtotal - directDiscount;

    if (activeVoucher && currentPriceTotal >= activeVoucher.minOrder) {
        if (voucherTagEl && voucherCodeTextEl) {
            voucherCodeTextEl.innerText = activeVoucher.code;
            voucherTagEl.classList.remove('hidden');
        }
    } else {
        if (voucherTagEl) voucherTagEl.classList.add('hidden');
    }

    let voucherDiscount = 0;
    let discountBreakdownHtml = `
        <div class="flex justify-between text-slate-600 items-start gap-2">
            <span>Giảm giá trực tiếp</span>
            <span class="font-bold text-red-600 shrink-0">-${directDiscount.toLocaleString('vi-VN')} đ</span>
        </div>
    `;

    if (activeVoucher && currentPriceTotal >= activeVoucher.minOrder) {
        voucherDiscount = activeVoucher.discountType === 'percent'
            ? Math.round((currentPriceTotal * activeVoucher.discountValue) / 100)
            : activeVoucher.discountValue;

        const voucherLabelText = activeVoucher.title
            ? `${activeVoucher.title} (${activeVoucher.desc || activeVoucher.code})`
            : activeVoucher.code;

        discountBreakdownHtml += `
            <div class="flex justify-between text-slate-600 items-start gap-2">
                <span>${voucherLabelText}</span>
                <span class="font-bold text-red-600 shrink-0">-${voucherDiscount.toLocaleString('vi-VN')} đ</span>
            </div>
        `;
    }

    if (discountBreakdownList) {
        discountBreakdownList.innerHTML = discountBreakdownHtml;
    }

    const baseShippingFee = (typeof SHIPPING_CONFIG !== 'undefined' && SHIPPING_CONFIG.shippingFee) ? SHIPPING_CONFIG.shippingFee : 30000;
    const freeThreshold = (typeof SHIPPING_CONFIG !== 'undefined' && SHIPPING_CONFIG.freeShippingThreshold) ? SHIPPING_CONFIG.freeShippingThreshold : 399000;

    const effectiveShippingFee = currentPriceTotal >= freeThreshold ? 0 : baseShippingFee;

    if (shippingFeeEl) {
        if (effectiveShippingFee === 0) {
            shippingFeeEl.innerText = 'Miễn phí';
            shippingFeeEl.className = 'font-bold text-emerald-600 shrink-0';
        } else {
            shippingFeeEl.innerText = effectiveShippingFee.toLocaleString('vi-VN') + ' đ';
            shippingFeeEl.className = 'font-bold text-slate-900 shrink-0';
        }
    }

    const finalTotal = Math.max(0, currentPriceTotal - voucherDiscount) + effectiveShippingFee;

    if (subtotalEl) subtotalEl.innerText = originalSubtotal.toLocaleString('vi-VN') + ' đ';
    if (finalTotalEl) finalTotalEl.innerText = finalTotal.toLocaleString('vi-VN') + ' đ';
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProvinces();
    renderCheckoutSummary();
    attachSessionInputListeners();
    if (window.lucide) lucide.createIcons();

    const checkoutForm = document.querySelector('form');
    if (checkoutForm) {
        checkoutForm.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                return false;
            }
        });
    }
});

window.addEventListener('pageshow', (event) => {
    loadCheckoutSession();
});

// BẮT SỰ KIỆN PHÍM ESC & VUỐT SANG PHẢI ĐỂ ĐÓNG VOUCHER MODAL
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
        const modal = document.getElementById('voucher-modal');
        if (modal && !modal.classList.contains('hidden')) {
            closeVoucherModal();
        }
    }
});

let voucherTouchStartX = 0;
let voucherTouchStartY = 0;
let isVoucherEdgeSwipe = false;

document.addEventListener('touchstart', (e) => {
    const startX = e.touches[0].clientX;

    if (startX < 35) {
        isVoucherEdgeSwipe = true;
        return;
    }

    isVoucherEdgeSwipe = false;
    voucherTouchStartX = e.changedTouches[0].screenX;
    voucherTouchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (isVoucherEdgeSwipe) return;

    const modal = document.getElementById('voucher-modal');
    if (modal && !modal.classList.contains('hidden')) {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;

        const deltaX = touchEndX - voucherTouchStartX;
        const deltaY = Math.abs(touchEndY - voucherTouchStartY);

        if (deltaX > 60 && deltaX > deltaY) {
            closeVoucherModal();
        }
    }
}, { passive: true });