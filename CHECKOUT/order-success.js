// Hàm tính ngày giao hàng dự kiến (3 ngày kể từ hôm nay)
function getEstimatedDeliveryDate() {
    const now = new Date();
    now.setDate(now.getDate() + 3);

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // Chuyển giờ 0 thành 12

    return `${day}/${month}/${year}; ${String(hours).padStart(2, '0')}:${minutes}${ampm}`;
}

// Render dữ liệu từ URL & Storage
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();

    // 1. Lấy orderId từ tham số URL (?orderId=INSIDE-20261009-67D4)
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId') || 'INSIDE-' + Date.now();

    // 2. Điền thông tin vào phần Order Summary
    const displayOrderId = document.getElementById('display-order-id');
    const displayTrackingId = document.getElementById('display-tracking-id');
    const displayDeliveryDate = document.getElementById('display-delivery-date');
    const displayAddress = document.getElementById('display-address');
    const displayTotalAmount = document.getElementById('display-total-amount');

    if (displayOrderId) displayOrderId.innerText = orderId;
    if (displayTrackingId) displayTrackingId.innerText = orderId.replace('INSIDE-', 'TK');
    if (displayDeliveryDate) displayDeliveryDate.innerText = getEstimatedDeliveryDate();

    // 3. Khôi phục thông tin từ Session/LocalStorage gần nhất nếu có
    const savedOrder = JSON.parse(localStorage.getItem('inside_last_order') || 'null');

    if (savedOrder && savedOrder.orderId === orderId) {
        if (displayAddress) displayAddress.innerText = savedOrder.customer?.fullAddress || savedOrder.customer?.address || 'Hà Nội, Việt Nam';
        if (displayTotalAmount) displayTotalAmount.innerText = (savedOrder.totalAmount || 0).toLocaleString('vi-VN') + ' đ';

        // Render danh sách sản phẩm
        renderOrderItems(savedOrder.items || []);
    } else {
        // Mẫu hiển thị giả lập nếu gọi trực tiếp trang
        if (displayAddress) displayAddress.innerText = 'Địa chỉ đã lưu trong đơn hàng';
        if (displayTotalAmount) displayTotalAmount.innerText = 'Đã thanh toán';

        renderOrderItems([
            {
                name: 'Áo T-Shirt INSIDE⁺ Minimalist',
                color: 'Đen',
                size: 'L',
                price: 350000,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300'
            }
        ]);
    }
});

function renderOrderItems(items) {
    const container = document.getElementById('order-items-container');
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 text-center py-2">Thông tin sản phẩm đơn hàng</p>';
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="flex items-center gap-3.5 py-1">
            <div class="w-14 h-14 bg-white rounded-lg border border-slate-200/80 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                <img src="${item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300'}" alt="${item.name}" class="w-full h-full object-cover rounded">
            </div>
            <div class="flex-1 min-w-0">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">INSIDE⁺</span>
                <h4 class="font-bold text-xs sm:text-sm text-slate-900 truncate">${item.name}</h4>
                <p class="text-[11px] text-slate-500 font-normal">Màu: ${item.color || 'Đen'} | Size: ${item.size || 'M'} x ${item.quantity || 1}</p>
            </div>
            <div class="text-right shrink-0">
                <span class="font-bold text-xs sm:text-sm text-slate-900">${((item.price || 0) * (item.quantity || 1)).toLocaleString('vi-VN')} đ</span>
            </div>
        </div>
    `).join('');
}