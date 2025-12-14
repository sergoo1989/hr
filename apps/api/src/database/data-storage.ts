// نظام التخزين الدائم للبيانات - Persistent Storage System
// ⚠️ تحذير: هذا النظام لا يعمل على Vercel لأن Vercel يستخدم نظام ملفات مؤقت
// ✅ يعمل بشكل ممتاز على: Railway (مع Volume), Render, VPS, Local Server
import * as fs from 'fs';
import * as path from 'path';

// دعم Railway Volume - إذا كان موجوداً استخدمه، وإلا استخدم المجلد المحلي
// لإعداد Volume في Railway: أضف Volume وحدد mount path كـ /app/data
const RAILWAY_VOLUME_PATH = process.env.RAILWAY_VOLUME_MOUNT_PATH || '/app/data';
const IS_RAILWAY = !!process.env.RAILWAY_ENVIRONMENT;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// تحديد مسار البيانات بناءً على البيئة
const DATA_DIR = IS_RAILWAY && IS_PRODUCTION 
  ? RAILWAY_VOLUME_PATH 
  : path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'hr-database.json');

export class DataStorage {
  private static instance: DataStorage;

  private constructor() {
    this.ensureDataDirectory();
  }

  static getInstance(): DataStorage {
    if (!DataStorage.instance) {
      DataStorage.instance = new DataStorage();
    }
    return DataStorage.instance;
  }

  private ensureDataDirectory() {
    // طباعة معلومات البيئة للتشخيص
    console.log('🔧 بيئة التشغيل:', IS_PRODUCTION ? 'إنتاج' : 'تطوير');
    console.log('🔧 Railway:', IS_RAILWAY ? 'نعم' : 'لا');
    console.log('📁 مسار البيانات:', DATA_DIR);
    console.log('📄 ملف البيانات:', DATA_FILE);
    
    // تحذير لمنصة Vercel
    if (process.env.VERCEL) {
      console.warn('⚠️⚠️⚠️ تحذير هام: أنت تعمل على Vercel!');
      console.warn('⚠️ Vercel لا يدعم التخزين الدائم للملفات');
      console.warn('⚠️ البيانات ستُفقد عند كل deployment جديد');
      console.warn('⚠️ الحل: استخدم Railway أو Render للـ API');
    }
    
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      console.log('📁 تم إنشاء مجلد البيانات');
    }
  }

  // حفظ البيانات إلى الملف
  saveData(data: any): void {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      
      // حفظ متزامن لضمان الكتابة الفورية
      fs.writeFileSync(DATA_FILE, jsonData, 'utf8');
      
      // تأكيد الكتابة على القرص فوراً
      const fd = fs.openSync(DATA_FILE, 'r+');
      fs.fsyncSync(fd);
      fs.closeSync(fd);
      
      console.log('💾 تم حفظ البيانات بنجاح - ' + new Date().toLocaleTimeString('ar-SA'));
    } catch (error) {
      console.error('❌ خطأ في حفظ البيانات:', error);
      // محاولة حفظ نسخة احتياطية
      try {
        const backupFile = DATA_FILE + '.backup';
        fs.writeFileSync(backupFile, JSON.stringify(data, null, 2), 'utf8');
        console.log('✅ تم حفظ نسخة احتياطية');
      } catch (backupError) {
        console.error('❌ فشل حفظ النسخة الاحتياطية:', backupError);
      }
    }
  }

  // تحميل البيانات من الملف
  loadData(): any | null {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const jsonData = fs.readFileSync(DATA_FILE, 'utf8');
        console.log('📂 تم تحميل البيانات من الملف');
        return JSON.parse(jsonData);
      }
      console.log('📄 لا يوجد ملف بيانات، سيتم إنشاء واحد جديد');
      return null;
    } catch (error) {
      console.error('❌ خطأ في تحميل البيانات:', error);
      return null;
    }
  }

  // حذف ملف البيانات (للاختبار)
  clearData(): void {
    try {
      if (fs.existsSync(DATA_FILE)) {
        fs.unlinkSync(DATA_FILE);
        console.log('🗑️ تم حذف ملف البيانات');
      }
    } catch (error) {
      console.error('❌ خطأ في حذف البيانات:', error);
    }
  }

  // التحقق من وجود ملف البيانات
  hasData(): boolean {
    return fs.existsSync(DATA_FILE);
  }
}
