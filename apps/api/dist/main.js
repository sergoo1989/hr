"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const in_memory_db_1 = require("./database/in-memory-db");
async function bootstrap() {
    const db = in_memory_db_1.InMemoryDatabase.getInstance();
    await db.seedInitialData();
    console.log('✅ قاعدة البيانات تم تهيئتها بنجاح');
    console.log('👤 المستخدمون المتاحون:');
    console.log('   - مدير: admin / admin123');
    process.on('uncaughtException', (error) => {
        console.error('❌ خطأ غير متوقع:', error);
        console.log('💾 جاري حفظ البيانات قبل الإغلاق...');
        db.saveToStorage();
        console.log('✅ تم حفظ البيانات بنجاح');
        process.exit(1);
    });
    process.on('unhandledRejection', (reason, promise) => {
        console.error('❌ Promise غير معالج:', reason);
        console.log('💾 جاري حفظ البيانات...');
        db.saveToStorage();
        console.log('✅ تم حفظ البيانات بنجاح');
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 HR API يعمل على المنفذ: ${port}`);
    console.log(`🌍 البيئة: ${process.env.NODE_ENV || 'development'}`);
    console.log('📡 الخادم جاهز لاستقبال الطلبات');
    console.log('💾 نظام الحفظ التلقائي مفعّل (كل 30 ثانية)');
}
bootstrap();
//# sourceMappingURL=main.js.map