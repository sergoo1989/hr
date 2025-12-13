"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const in_memory_db_1 = require("../database/in-memory-db");
let SettingsService = class SettingsService {
    constructor() {
        this.db = in_memory_db_1.InMemoryDatabase.getInstance();
    }
    getCompanySettings() {
        return this.db.getCompanySettings();
    }
    updateCompanySettings(settings) {
        return this.db.updateCompanySettings(settings);
    }
    getAllDepartments() {
        return this.db.getAllDepartments();
    }
    createDepartment(name) {
        return this.db.createDepartment(name);
    }
    deleteDepartment(id) {
        const success = this.db.deleteDepartment(id);
        if (!success) {
            throw new Error('القسم غير موجود');
        }
        return { success: true, message: 'تم حذف القسم بنجاح' };
    }
    getAllJobTitles() {
        return this.db.getAllJobTitles();
    }
    createJobTitle(title) {
        return this.db.createJobTitle(title);
    }
    deleteJobTitle(id) {
        const success = this.db.deleteJobTitle(id);
        if (!success) {
            throw new Error('المسمى الوظيفي غير موجود');
        }
        return { success: true, message: 'تم حذف المسمى الوظيفي بنجاح' };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)()
], SettingsService);
//# sourceMappingURL=settings.service.js.map