// ملف إعدادات API URL
const Config = {
    // سيتم تحديد الـ API URL حسب البيئة
    getApiUrl: function() {
        // اكتشاف تلقائي للسيرفر
        // إذا كان النظام يعمل على localhost، استخدم localhost
        // وإلا، استخدم نفس IP الذي يعمل عليه Frontend
        const hostname = window.location.hostname;
        
        // إذا كان localhost أو 127.0.0.1، استخدم localhost
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        }
        
        // استخدم نفس IP السيرفر مع المنفذ 3000
        return `http://${hostname}:3000`;
    }
};

// تصدير API_URL للتوافق مع الكود القديم
const API_URL = Config.getApiUrl();

// عرض معلومات الاتصال في Console للتأكد
console.log('🌐 API Configuration:');
console.log('   Frontend: ' + window.location.origin);
console.log('   API URL: ' + API_URL);
console.log('   Hostname: ' + window.location.hostname);
