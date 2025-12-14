import { SettingsService } from './settings.service';
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
    getCompanySettings(): import("../database/in-memory-db").CompanySettings;
    updateCompanySettings(settings: any): import("../database/in-memory-db").CompanySettings;
    getAllDepartments(): import("../database/in-memory-db").Department[];
    createDepartment(body: {
        name: string;
    }): import("../database/in-memory-db").Department;
    updateDepartment(id: string, body: {
        name: string;
    }): import("../database/in-memory-db").Department;
    deleteDepartment(id: string): {
        success: boolean;
        message: string;
    };
    getAllJobTitles(): import("../database/in-memory-db").JobTitle[];
    createJobTitle(body: {
        title: string;
    }): import("../database/in-memory-db").JobTitle;
    updateJobTitle(id: string, body: {
        title: string;
    }): import("../database/in-memory-db").JobTitle;
    deleteJobTitle(id: string): {
        success: boolean;
        message: string;
    };
}
