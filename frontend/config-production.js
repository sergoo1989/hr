// ملف إعدادات API URL - نسخة للنشر على الإنترنت
const Config = {
    getApiUrl: function() {
        // ═══════════════════════════════════════════════════════════
        // 🌐 للنشر على الإنترنت (Railway/Render/Heroku)
        // ═══════════════════════════════════════════════════════════
        
        // استبدل الرابط ده برابط API بتاعك من Railway
        const PRODUCTION_API_URL = 'https://your-app.railway.app';
        
        // ═══════════════════════════════════════════════════════════
        // 🏠 للتطوير المحلي (على الجهاز)
        // ═══════════════════════════════════════════════════════════
        const DEVELOPMENT_API_URL = 'http://localhost:3000';
        
        // ═══════════════════════════════════════════════════════════
        // تحديد البيئة تلقائياً
        // ═══════════════════════════════════════════════════════════
        
        const hostname = window.location.hostname;
        
        // إذا localhost أو 127.0.0.1، استخدم API المحلي
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            console.log('🏠 بيئة التطوير المحلي');
            return DEVELOPMENT_API_URL;
        }
        
        // إذا IP محلي (مثل 192.168.x.x)، استخدم نفس IP للـ API
        if (hostname.match(/^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
            console.log('🌐 شبكة محلية');
            return `http://${hostname}:3000`;
        }
        
        // في أي حالة أخرى، استخدم API الإنتاج (الإنترنت)
        console.log('☁️ بيئة الإنتاج (الإنترنت)');
        return PRODUCTION_API_URL;
    }
};

// تصدير API_URL للتوافق مع الكود القديم
const API_URL = Config.getApiUrl();

// عرض معلومات الاتصال في Console
console.log('═══════════════════════════════════════');
console.log('🔗 إعدادات API:');
console.log('   Frontend:', window.location.origin);
console.log('   API URL:', API_URL);
console.log('   Hostname:', window.location.hostname);
console.log('═══════════════════════════════════════');
