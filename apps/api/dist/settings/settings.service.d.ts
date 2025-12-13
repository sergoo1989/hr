export declare class SettingsService {
    private db;
    getCompanySettings(): import("../database/in-memory-db").CompanySettings;
    updateCompanySettings(settings: any): import("../database/in-memory-db").CompanySettings;
    getAllDepartments(): import("../database/in-memory-db").Department[];
    createDepartment(name: string): import("../database/in-memory-db").Department;
    deleteDepartment(id: number): {
        success: boolean;
        message: string;
    };
    getAllJobTitles(): import("../database/in-memory-db").JobTitle[];
    createJobTitle(title: string): import("../database/in-memory-db").JobTitle;
    deleteJobTitle(id: number): {
        success: boolean;
        message: string;
    };
}
