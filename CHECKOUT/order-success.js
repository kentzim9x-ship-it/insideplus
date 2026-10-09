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
    hours = hours ? hours : 12;

    return `${day}/${month}/${year}; ${String(hours).padStart(2, '0')}:${minutes}${ampm}`;
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    const displayOrderId = document.getElementById('display-order-id');
    const displayTrackingId = document.getElementById('display-tracking-id');
    const displayDeliveryDate = document.getElementById('display-delivery-date');
    const displayAddress = document.getElementById('display-address');
    const displayTotalAmount = document.getElementById('display-total-amount');

    // Lấy thông tin đơn hàng vừa lưu trong bộ nhớ
    const savedOrder = JSON.parse(localStorage.getItem('inside_last_order') || 'null');

    if (savedOrder && (!orderId || savedOrder.orderId === orderId)) {
        if (displayOrderId) displayOrderId.innerText = savedOrder.orderId;
        if (displayTrackingId) displayTrackingId.innerText = savedOrder.orderId.replace('INSIDE-', 'TK');
        if (displayDeliveryDate) displayDeliveryDate.innerText = getEstimatedDeliveryDate();
        if (displayAddress) displayAddress.innerText = savedOrder.customer?.fullAddress || savedOrder.customer?.address || 'Hà Nội';

        if (displayTotalAmount) {
            const isCOD = savedOrder.payment?.method === 'COD';
            const statusText = isCOD ? ' (COD)' : ' (Chuyển khoản)';
            displayTotalAmount.innerText = `${(savedOrder.totalAmount || 0).toLocaleString('vi-VN')} đ${statusText}`;
        }

        // Render toàn bộ các sản phẩm thực tế trong đơn
        renderOrderItems(savedOrder.items || []);
    } else {
        if (displayOrderId) displayOrderId.innerText = orderId || 'INSIDE-UNKNOWN';
        if (displayTrackingId) displayTrackingId.innerText = (orderId || 'TK-UNKNOWN').replace('INSIDE-', 'TK');
        if (displayDeliveryDate) displayDeliveryDate.innerText = getEstimatedDeliveryDate();
        if (displayAddress) displayAddress.innerText = 'Địa chỉ đã lưu trong đơn hàng';
        if (displayTotalAmount) displayTotalAmount.innerText = 'Đã đặt hàng';

        renderOrderItems([]);
    }
});

function renderOrderItems(items) {
    const container = document.getElementById('order-items-container');
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 text-center py-2">Không tìm thấy danh sách sản phẩm chi tiết</p>';
        return;
    }

    const fallbackImg = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300';

    container.innerHTML = items.map(item => `
        <div class="flex items-center gap-3.5 py-2.5 border-b border-slate-100 last:border-0">
            <div class="w-14 h-14 bg-white rounded-lg border border-slate-200/80 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                <img src="${item.image || fallbackImg}" 
                     onerror="this.onerror=null; this.src='${fallbackImg}';"
                     alt="${item.name}" 
                     class="w-full h-full object-cover rounded">
            </div>
            <div class="flex-1 min-w-0">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">INSIDE⁺</span>
                <h4 class="font-bold text-xs sm:text-sm text-slate-900 truncate">${item.name}</h4>
                <p class="text-[11px] text-slate-500 font-normal">Màu: ${item.color || 'Đen'} | Size: ${item.size || 'S'} | SL: x${item.quantity || 1}</p>
            </div>
            <div class="text-right shrink-0">
                <span class="font-bold text-xs sm:text-sm text-slate-900">${((item.price || 0) * (item.quantity || 1)).toLocaleString('vi-VN')} đ</span>
            </div>
        </div>
    `).join('');
}