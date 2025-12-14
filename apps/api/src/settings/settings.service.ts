import { Injectable } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory-db';

@Injectable()
export class SettingsService {
  private db = InMemoryDatabase.getInstance();

  // Company Settings
  getCompanySettings() {
    return this.db.getCompanySettings();
  }

  updateCompanySettings(settings: any) {
    return this.db.updateCompanySettings(settings);
  }

  // Departments
  getAllDepartments() {
    return this.db.getAllDepartments();
  }

  createDepartment(name: string) {
    return this.db.createDepartment(name);
  }

  updateDepartment(id: number, name: string) {
    const department = this.db.updateDepartment(id, name);
    if (!department) {
      throw new Error('القسم غير موجود');
    }
    return department;
  }

  deleteDepartment(id: number) {
    const success = this.db.deleteDepartment(id);
    if (!success) {
      throw new Error('القسم غير موجود');
    }
    return { success: true, message: 'تم حذف القسم بنجاح' };
  }

  // Job Titles
  getAllJobTitles() {
    return this.db.getAllJobTitles();
  }

  createJobTitle(title: string) {
    return this.db.createJobTitle(title);
  }

  updateJobTitle(id: number, title: string) {
    const jobTitle = this.db.updateJobTitle(id, title);
    if (!jobTitle) {
      throw new Error('المسمى الوظيفي غير موجود');
    }
    return jobTitle;
  }

  deleteJobTitle(id: number) {
    const success = this.db.deleteJobTitle(id);
    if (!success) {
      throw new Error('المسمى الوظيفي غير موجود');
    }
    return { success: true, message: 'تم حذف المسمى الوظيفي بنجاح' };
  }
}
