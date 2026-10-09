// File: orderService.js

const USE_MOCK_API = true; // Đổi thành false khi bạn đã xây dựng xong Backend

// DÁN URL WEB APP GOOGLE APPS SCRIPT VỪA LẤY Ở BƯỚC 1.3 VÀO ĐÂY
const GOOGLE_SCRIPT_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzhduebI26hvqe8oyY6sd0QnsEumrodT2jWLCl8MspqPOzrCZiEo9GCNfj3Nu_LLe6Rxg/exec';

const OrderService = {
    async createOrder(orderPayload) {
        try {
            // Sử dụng mode no-cors nếu gặp CORS hoặc dùng fetch POST chuẩn với text/plain để tránh CORS trên GAS
            const response = await fetch(GOOGLE_SCRIPT_WEBAPP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8', 
                },
                body: JSON.stringify(orderPayload)
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Lỗi khi gửi đơn hàng lên Google Apps Script:', error);
            throw error;
        }
    }
};