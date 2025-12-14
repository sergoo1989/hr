// ملف إعدادات API URL
const Config = {
    // سيتم تحديد الـ API URL حسب البيئة
    getApiUrl: function() {
        const hostname = window.location.hostname;
        
        // للتطوير المحلي
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        }
        
        // للشبكة المحلية
        if (hostname.match(/^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
            return `http://${hostname}:3000`;
        }
        
        // للإنتاج (الإنترنت) - Render API
        return 'https://hr-system-4izb.onrender.com';
    }
};

// تصدير API_URL للتوافق مع الكود القديم
const API_URL = Config.getApiUrl();

// عرض معلومات الاتصال في Console للتأكد
console.log('🌐 API Configuration:');
console.log('   Frontend: ' + window.location.origin);
console.log('   API URL: ' + API_URL);
