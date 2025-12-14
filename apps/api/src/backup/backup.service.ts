import { Injectable } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory-db';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BackupService {
  private db = InMemoryDatabase.getInstance();
  private backupsDir = path.join(process.cwd(), 'backups');

  constructor() {
    // إنشاء مجلد النسخ الاحتياطية إذا لم يكن موجوداً
    if (!fs.existsSync(this.backupsDir)) {
      fs.mkdirSync(this.backupsDir, { recursive: true });
    }
  }

  /**
   * إنشاء نسخة احتياطية من البيانات
   */
  createBackup() {
    const data = this.db.getAllData();
    
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: data,
      stats: {
        employees: data.employees?.length || 0,
        users: data.users?.length || 0,
        leaves: data.leaves?.length || 0,
        advances: data.advances?.length || 0,
        assets: data.assets?.length || 0,
        departments: data.departments?.length || 0,
        jobTitles: data.jobTitles?.length || 0,
        attendances: data.attendances?.length || 0,
        payrollRecords: data.payrollRecords?.length || 0,
        notifications: data.notifications?.length || 0
      }
    };
  }

  /**
   * استعادة البيانات من نسخة احتياطية
   */
  restoreBackup(backupData: any) {
    try {
      // التحقق من صحة البيانات
      if (!backupData.data) {
        throw new Error('البيانات غير صحيحة');
      }

      // استعادة البيانات
      const result = this.db.loadFromBackup(backupData.data);

      // حفظ البيانات المستعادة في الملف
      this.saveToFile();

      return {
        restored: true,
        timestamp: backupData.timestamp,
        stats: backupData.stats
      };
    } catch (error) {
      throw new Error(`فشل في استعادة البيانات: ${error.message}`);
    }
  }

  /**
   * معلومات عن البيانات الحالية
   */
  getBackupInfo() {
    const data = this.db.getAllData();
    
    return {
      currentData: {
        employees: data.employees?.length || 0,
        users: data.users?.length || 0,
        leaves: data.leaves?.length || 0,
        advances: data.advances?.length || 0,
        assets: data.assets?.length || 0,
        departments: data.departments?.length || 0,
        jobTitles: data.jobTitles?.length || 0,
        attendances: data.attendances?.length || 0,
        payrollRecords: data.payrollRecords?.length || 0,
        notifications: data.notifications?.length || 0
      },
      lastSaved: this.getLastSaveTime(),
      backupFiles: this.listBackupFiles()
    };
  }

  /**
   * حفظ البيانات في ملف
   */
  saveToFile() {
    this.db.saveToStorage();
  }

  /**
   * الحصول على وقت آخر حفظ
   */
  private getLastSaveTime(): string | null {
    try {
      const dbPath = path.join(process.cwd(), 'apps', 'api', 'data', 'hr-database.json');
      if (fs.existsSync(dbPath)) {
        const stats = fs.statSync(dbPath);
        return stats.mtime.toISOString();
      }
    } catch (error) {
      console.error('خطأ في قراءة وقت آخر حفظ:', error);
    }
    return null;
  }

  /**
   * قائمة ملفات النسخ الاحتياطية
   */
  private listBackupFiles() {
    try {
      if (fs.existsSync(this.backupsDir)) {
        const files = fs.readdirSync(this.backupsDir)
          .filter(file => file.endsWith('.json'))
          .map(file => {
            const filePath = path.join(this.backupsDir, file);
            const stats = fs.statSync(filePath);
            return {
              name: file,
              size: stats.size,
              created: stats.birthtime.toISOString(),
              modified: stats.mtime.toISOString()
            };
          })
          .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        
        return files;
      }
    } catch (error) {
      console.error('خطأ في قراءة ملفات النسخ الاحتياطية:', error);
    }
    return [];
  }

  /**
   * إنشاء نسخة احتياطية تلقائية
   */
  async createAutoBackup() {
    try {
      const backup = this.createBackup();
      const filename = `auto-backup-${new Date().toISOString().replace(/:/g, '-').split('.')[0]}.json`;
      const filepath = path.join(this.backupsDir, filename);
      
      fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));
      
      // حذف النسخ الاحتياطية القديمة (الاحتفاظ بآخر 10 نسخ)
      this.cleanOldBackups(10);
      
      return { success: true, filename };
    } catch (error) {
      console.error('فشل في إنشاء نسخة احتياطية تلقائية:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * حذف النسخ الاحتياطية القديمة
   */
  private cleanOldBackups(keepCount: number) {
    try {
      const files = this.listBackupFiles();
      
      if (files.length > keepCount) {
        const filesToDelete = files.slice(keepCount);
        
        filesToDelete.forEach(file => {
          const filepath = path.join(this.backupsDir, file.name);
          fs.unlinkSync(filepath);
        });
      }
    } catch (error) {
      console.error('خطأ في حذف النسخ الاحتياطية القديمة:', error);
    }
  }
}
