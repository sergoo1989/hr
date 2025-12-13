import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InMemoryDatabase } from './database/in-memory-db';

async function bootstrap() {
  // Initialize in-memory database with seed data
  const db = InMemoryDatabase.getInstance();
  await db.seedInitialData();
  console.log('✅ قاعدة البيانات تم تهيئتها بنجاح');
  console.log('👤 المستخدمون المتاحون:');
  console.log('   - مدير: admin / admin123');

  // حفظ البيانات عند أي خطأ غير متوقع
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

  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with explicit configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // Allow configured origins or all in development
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
