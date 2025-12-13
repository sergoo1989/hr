// ملف إعدادات API URL
const API_CONFIG = {
    // سيتم تحديد الـ API URL حسب البيئة
    getApiUrl: function() {
        // استخدام Replit API
        return 'https://f87c6725-9b2c-4c75-92db-eebbde59d71-00-17npf2gkd4yj4.pike.replit.dev:3000';
    }
};

// تصدير API_URL للاستخدام في جميع الصفحات
const API_URL = API_CONFIG.getApiUrl();
