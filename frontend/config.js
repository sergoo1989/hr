// ملف إعدادات API URL
const Config = {
    // سيتم تحديد الـ API URL حسب البيئة
    getApiUrl: function() {
        // استخدام API المحلي
        return 'http://localhost:3000';
    }
};

// تصدير API_URL للتوافق مع الكود القديم (سيتم حذفه لاحقاً)
const API_URL = Config.getApiUrl();
