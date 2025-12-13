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
  console.log('   - موظف: employee1 / emp123');

  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with explicit configuration
  app.enableCors({
    origin: '*', // Allow all origins in development
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
