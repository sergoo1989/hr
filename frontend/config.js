// ملف إعدادات API URL
const API_CONFIG = {
    // سيتم تحديد الـ API URL حسب البيئة
    getApiUrl: function() {
        // استخدام API المحلي دائماً
        return 'http://localhost:3000';
    }
};

// تصدير API_URL للاستخدام في جميع الصفحات
const API_URL = API_CONFIG.getApiUrl();
