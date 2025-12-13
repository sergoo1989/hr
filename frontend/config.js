// ملف إعدادات API URL
const API_CONFIG = {
    // سيتم تحديد الـ API URL حسب البيئة
    getApiUrl: function() {
        // استخدام Render API
        return 'https://hr-api-aak6.onrender.com';
    }
};

// تصدير API_URL للاستخدام في جميع الصفحات
const API_URL = API_CONFIG.getApiUrl();
