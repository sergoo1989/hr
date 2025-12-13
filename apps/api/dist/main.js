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
    console.log('   - موظف: employee1 / emp123');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    const port = 3000;
    await app.listen(port);
    console.log(`🚀 HR API يعمل على: http://localhost:${port}`);
    console.log('📡 الخادم جاهز لاستقبال الطلبات');
}
bootstrap();
//# sourceMappingURL=main.js.map