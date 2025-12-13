// نظام التخزين الدائم للبيانات - Persistent Storage System
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
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
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      console.log('📁 تم إنشاء مجلد البيانات');
    }
  }

  // حفظ البيانات إلى الملف
  saveData(data: any): void {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      fs.writeFileSync(DATA_FILE, jsonData, 'utf8');
      console.log('💾 تم حفظ البيانات بنجاح');
    } catch (error) {
      console.error('❌ خطأ في حفظ البيانات:', error);
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
