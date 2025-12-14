"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataStorage = void 0;
const fs = require("fs");
const path = require("path");
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'hr-database.json');
class DataStorage {
    constructor() {
        this.ensureDataDirectory();
    }
    static getInstance() {
        if (!DataStorage.instance) {
            DataStorage.instance = new DataStorage();
        }
        return DataStorage.instance;
    }
    ensureDataDirectory() {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
            console.log('📁 تم إنشاء مجلد البيانات');
        }
    }
    saveData(data) {
        try {
            const jsonData = JSON.stringify(data, null, 2);
            fs.writeFileSync(DATA_FILE, jsonData, 'utf8');
            const fd = fs.openSync(DATA_FILE, 'r+');
            fs.fsyncSync(fd);
            fs.closeSync(fd);
            console.log('💾 تم حفظ البيانات بنجاح - ' + new Date().toLocaleTimeString('ar-SA'));
        }
        catch (error) {
            console.error('❌ خطأ في حفظ البيانات:', error);
            try {
                const backupFile = DATA_FILE + '.backup';
                fs.writeFileSync(backupFile, JSON.stringify(data, null, 2), 'utf8');
                console.log('✅ تم حفظ نسخة احتياطية');
            }
            catch (backupError) {
                console.error('❌ فشل حفظ النسخة الاحتياطية:', backupError);
            }
        }
    }
    loadData() {
        try {
            if (fs.existsSync(DATA_FILE)) {
                const jsonData = fs.readFileSync(DATA_FILE, 'utf8');
                console.log('📂 تم تحميل البيانات من الملف');
                return JSON.parse(jsonData);
            }
            console.log('📄 لا يوجد ملف بيانات، سيتم إنشاء واحد جديد');
            return null;
        }
        catch (error) {
            console.error('❌ خطأ في تحميل البيانات:', error);
            return null;
        }
    }
    clearData() {
        try {
            if (fs.existsSync(DATA_FILE)) {
                fs.unlinkSync(DATA_FILE);
                console.log('🗑️ تم حذف ملف البيانات');
            }
        }
        catch (error) {
            console.error('❌ خطأ في حذف البيانات:', error);
        }
    }
    hasData() {
        return fs.existsSync(DATA_FILE);
    }
}
exports.DataStorage = DataStorage;
//# sourceMappingURL=data-storage.js.map