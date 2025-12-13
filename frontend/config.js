// ملف إعدادات API URL
const API_CONFIG = {
    // سيتم تحديد الـ API URL حسب البيئة
    getApiUrl: function() {
        // إذا كان هناك متغير بيئة محدد
        if (window.API_URL) {
            return window.API_URL;
        }
        
        // في بيئة الإنتاج (Vercel)
        if (window.location.hostname !== 'localhost' && 
            window.location.hostname !== '127.0.0.1' &&
            !window.location.hostname.startsWith('192.168.')) {
            // رابط Railway API
            return window.PRODUCTION_API_URL || 'https://hr-production-3cbb.up.railway.app';
        }
        
        // في بيئة التطوير المحلية
        return 'http://localhost:3000';
    }
};

// تصدير API_URL للاستخدام في جميع الصفحات
const API_URL = API_CONFIG.getApiUrl();
