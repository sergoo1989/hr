"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryDatabase = void 0;
const bcrypt = require("bcrypt");
const data_storage_1 = require("./data-storage");
class InMemoryDatabase {
    constructor() {
        this.users = [];
        this.employees = [];
        this.leaves = [];
        this.advances = [];
        this.assets = [];
        this.departments = [];
        this.jobTitles = [];
        this.companySettings = null;
        this.userIdCounter = 1;
        this.employeeIdCounter = 1;
        this.leaveIdCounter = 1;
        this.advanceIdCounter = 1;
        this.assetIdCounter = 1;
        this.departmentIdCounter = 1;
        this.jobTitleIdCounter = 1;
        this.storage = data_storage_1.DataStorage.getInstance();
        this.loadFromStorage();
        this.seedInitialData();
    }
    static getInstance() {
        if (!InMemoryDatabase.instance) {
            InMemoryDatabase.instance = new InMemoryDatabase();
        }
        return InMemoryDatabase.instance;
    }
    loadFromStorage() {
        const data = this.storage.loadData();
        if (data) {
            this.users = data.users || [];
            this.employees = data.employees || [];
            this.leaves = data.leaves || [];
            this.advances = data.advances || [];
            this.assets = data.assets || [];
            this.departments = data.departments || [];
            this.jobTitles = data.jobTitles || [];
            this.companySettings = data.companySettings || null;
            this.userIdCounter = data.userIdCounter || 1;
            this.employeeIdCounter = data.employeeIdCounter || 1;
            this.leaveIdCounter = data.leaveIdCounter || 1;
            this.advanceIdCounter = data.advanceIdCounter || 1;
            this.assetIdCounter = data.assetIdCounter || 1;
            this.departmentIdCounter = data.departmentIdCounter || 1;
            this.jobTitleIdCounter = data.jobTitleIdCounter || 1;
            console.log('✅ تم تحميل البيانات المحفوظة');
        }
    }
    saveToStorage() {
        const data = {
            users: this.users,
            employees: this.employees,
            leaves: this.leaves,
            advances: this.advances,
            assets: this.assets,
            departments: this.departments,
            jobTitles: this.jobTitles,
            companySettings: this.companySettings,
            userIdCounter: this.userIdCounter,
            employeeIdCounter: this.employeeIdCounter,
            leaveIdCounter: this.leaveIdCounter,
            advanceIdCounter: this.advanceIdCounter,
            assetIdCounter: this.assetIdCounter,
            departmentIdCounter: this.departmentIdCounter,
            jobTitleIdCounter: this.jobTitleIdCounter,
        };
        this.storage.saveData(data);
    }
    async seedInitialData() {
        if (this.storage.hasData() && this.employees.length > 0) {
            console.log('✅ البيانات المحفوظة جاهزة للاستخدام');
            return;
        }
        console.log('🌱 تحميل البيانات الافتراضية...');
        const adminEmployee = {
            id: this.employeeIdCounter++,
            fullName: 'مدير النظام',
            employeeNumber: 'EMP001',
            nationalId: '1234567890',
            email: 'admin@company.com',
            phone: '+966501234567',
            department: 'الإدارة',
            jobTitle: 'مدير الموارد البشرية',
            hireDate: new Date('2020-01-01'),
            basicSalary: 10000,
            housingAllowance: 3000,
            transportAllowance: 1000,
            nationality: 'SAUDI',
        };
        this.employees.push(adminEmployee);
        const employee = {
            id: this.employeeIdCounter++,
            fullName: 'أحمد محمد السعيد',
            employeeNumber: 'EMP002',
            nationalId: '1234567891',
            email: 'ahmed@company.com',
            phone: '+966501234568',
            department: 'تقنية المعلومات',
            jobTitle: 'مطور برامج',
            hireDate: new Date('2021-06-15'),
            basicSalary: 8000,
            housingAllowance: 2500,
            transportAllowance: 800,
            nationality: 'SAUDI',
        };
        this.employees.push(employee);
        const adminPasswordHash = await bcrypt.hash('admin123', 10);
        const adminUser = {
            id: this.userIdCounter++,
            username: 'admin',
            password: adminPasswordHash,
            role: 'ADMIN',
            employeeId: adminEmployee.id,
            isActive: true,
            mustChangePassword: false,
            email: 'admin@hr-system.com',
        };
        this.users.push(adminUser);
        const empPasswordHash = await bcrypt.hash('emp123', 10);
        const empUser = {
            id: this.userIdCounter++,
            username: 'employee1',
            password: empPasswordHash,
            role: 'EMPLOYEE',
            employeeId: employee.id,
            isActive: true,
            mustChangePassword: false,
            email: 'employee1@hr-system.com',
        };
        this.users.push(empUser);
        const leave1 = {
            id: this.leaveIdCounter++,
            employeeId: employee.id,
            type: 'ANNUAL',
            leaveType: 'إجازة سنوية',
            startDate: new Date('2024-12-20').toISOString(),
            endDate: new Date('2024-12-25').toISOString(),
            days: 5,
            daysCount: 5,
            status: 'PENDING',
            requestDate: new Date('2024-12-10').toISOString(),
            reason: 'عطلة نهاية العام',
        };
        this.leaves.push(leave1);
        const leave2 = {
            id: this.leaveIdCounter++,
            employeeId: employee.id,
            type: 'SICK',
            leaveType: 'إجازة مرضية',
            startDate: new Date('2024-11-15').toISOString(),
            endDate: new Date('2024-11-17').toISOString(),
            days: 2,
            daysCount: 2,
            status: 'APPROVED',
            requestDate: new Date('2024-11-14').toISOString(),
            reason: 'مرض',
        };
        this.leaves.push(leave2);
        const advance1 = {
            id: this.advanceIdCounter++,
            employeeId: employee.id,
            amount: 5000,
            requestDate: new Date('2024-12-01').toISOString(),
            status: 'PENDING',
            reason: 'احتياجات شخصية',
        };
        this.advances.push(advance1);
        const advance2 = {
            id: this.advanceIdCounter++,
            employeeId: employee.id,
            amount: 3000,
            requestDate: new Date('2024-11-10').toISOString(),
            status: 'APPROVED',
            reason: 'ظروف طارئة',
        };
        this.advances.push(advance2);
        const asset1 = {
            id: this.assetIdCounter++,
            employeeId: employee.id,
            assetType: 'LAPTOP',
            description: 'Dell Latitude 5520',
            assignedDate: new Date('2021-06-15').toISOString(),
            returned: false,
            confirmed: true,
            confirmedDate: new Date('2021-06-15').toISOString(),
        };
        this.assets.push(asset1);
        this.companySettings = {
            id: 1,
            companyName: 'شركة الموارد البشرية',
            companyNameEn: 'HR Company',
            email: 'info@hrcompany.com',
            phone: '+966501234567',
            address: 'الرياض، المملكة العربية السعودية',
            taxNumber: '300000000000003',
        };
        const departments = [
            'الإدارة',
            'تقنية المعلومات',
            'الموارد البشرية',
            'المالية',
            'التسويق',
            'المبيعات',
        ];
        departments.forEach(dept => {
            this.departments.push({
                id: this.departmentIdCounter++,
                name: dept,
                createdAt: new Date().toISOString(),
            });
        });
        const jobTitles = [
            'مدير الموارد البشرية',
            'مطور برامج',
            'مدير مالي',
            'محاسب',
            'مدير تسويق',
            'مندوب مبيعات',
            'موظف إداري',
        ];
        jobTitles.forEach(title => {
            this.jobTitles.push({
                id: this.jobTitleIdCounter++,
                title: title,
                createdAt: new Date().toISOString(),
            });
        });
        console.log('✅ تم تحميل البيانات الافتراضية');
        console.log('👤 Admin: admin / admin123');
        console.log('👤 Employee: employee1 / emp123');
        console.log('📋 تم إضافة: 2 إجازات، 2 سلف، 1 أصل');
        console.log('🏢 تم إضافة: ' + this.departments.length + ' أقسام، ' + this.jobTitles.length + ' مسميات وظيفية');
        this.saveToStorage();
    }
    async createUser(username, password, role, employeeId, email, isActive = true, mustChangePassword = false) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const activationToken = this.generateActivationToken();
        const user = {
            id: this.userIdCounter++,
            username,
            password: hashedPassword,
            role,
            employeeId,
            email,
            isActive,
            mustChangePassword,
            activationToken,
        };
        this.users.push(user);
        this.saveToStorage();
        return user;
    }
    findUserByUsername(username) {
        return this.users.find(u => u.username === username);
    }
    findUserById(id) {
        return this.users.find(u => u.id === id);
    }
    findUserByEmployeeId(employeeId) {
        return this.users.find(u => u.employeeId === employeeId);
    }
    findUserByActivationToken(token) {
        return this.users.find(u => u.activationToken === token);
    }
    updateUserPassword(userId, newHashedPassword) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.password = newHashedPassword;
            user.mustChangePassword = false;
            this.saveToStorage();
        }
    }
    activateUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.isActive = true;
            user.activationToken = undefined;
            this.saveToStorage();
        }
    }
    generateActivationToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    createEmployee(data) {
        const employeeNumber = data.employeeNumber || `EMP${String(this.employeeIdCounter).padStart(3, '0')}`;
        const employee = Object.assign(Object.assign({ id: this.employeeIdCounter++ }, data), { employeeNumber });
        this.employees.push(employee);
        this.saveToStorage();
        return employee;
    }
    findEmployeeById(id) {
        return this.employees.find(e => e.id === id);
    }
    findAllEmployees() {
        return this.employees;
    }
    updateEmployee(id, data) {
        const index = this.employees.findIndex(e => e.id === id);
        if (index !== -1) {
            this.employees[index] = Object.assign(Object.assign({}, this.employees[index]), data);
            this.saveToStorage();
            return this.employees[index];
        }
        return undefined;
    }
    createLeave(data) {
        const leave = Object.assign({ id: this.leaveIdCounter++ }, data);
        this.leaves.push(leave);
        this.saveToStorage();
        return leave;
    }
    findLeavesByEmployeeId(employeeId) {
        return this.leaves.filter(l => l.employeeId === employeeId);
    }
    findPendingLeaves() {
        return this.leaves.filter(l => l.status === 'PENDING');
    }
    findAllLeaves() {
        return this.leaves;
    }
    updateLeaveStatus(id, status) {
        const leave = this.leaves.find(l => l.id === id);
        if (leave) {
            leave.status = status;
            this.saveToStorage();
            return leave;
        }
        return undefined;
    }
    createAdvance(data) {
        const advance = Object.assign({ id: this.advanceIdCounter++ }, data);
        this.advances.push(advance);
        this.saveToStorage();
        return advance;
    }
    findAdvancesByEmployeeId(employeeId) {
        return this.advances.filter(a => a.employeeId === employeeId);
    }
    findPendingAdvances() {
        return this.advances.filter(a => a.status === 'PENDING');
    }
    updateAdvanceStatus(id, status) {
        const advance = this.advances.find(a => a.id === id);
        if (advance) {
            advance.status = status;
            this.saveToStorage();
            return advance;
        }
        return undefined;
    }
    createAsset(data) {
        const asset = Object.assign({ id: this.assetIdCounter++ }, data);
        this.assets.push(asset);
        this.saveToStorage();
        return asset;
    }
    findAssetsByEmployeeId(employeeId) {
        return this.assets.filter(a => a.employeeId === employeeId);
    }
    findAssetById(id) {
        return this.assets.find(a => a.id === id);
    }
    findAllAssets() {
        return this.assets;
    }
    confirmAssetReceipt(assetId, employeeId) {
        const asset = this.assets.find(a => a.id === assetId && a.employeeId === employeeId);
        if (asset && !asset.confirmed) {
            asset.confirmed = true;
            asset.confirmedDate = new Date().toISOString();
            this.saveToStorage();
            return asset;
        }
        return undefined;
    }
    deleteAsset(id) {
        const index = this.assets.findIndex(a => a.id === id);
        if (index > -1) {
            this.assets.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }
    getLeaves() {
        return this.leaves;
    }
    getAllLeaves() {
        return this.leaves;
    }
    getAdvances() {
        return this.advances;
    }
    getAllAdvances() {
        return this.advances;
    }
    getAllEmployees() {
        return this.employees;
    }
    getActiveAssetsCount() {
        return this.assets.filter(a => !a.returned).length;
    }
    getTotalEmployees() {
        return this.employees.length;
    }
    getPendingLeavesCount() {
        return this.leaves.filter(l => l.status === 'PENDING').length;
    }
    getPendingAdvancesCount() {
        return this.advances.filter(a => a.status === 'PENDING').length;
    }
    getAllDepartments() {
        return this.departments;
    }
    createDepartment(name) {
        const dept = {
            id: this.departmentIdCounter++,
            name,
            createdAt: new Date().toISOString(),
        };
        this.departments.push(dept);
        this.saveToStorage();
        return dept;
    }
    deleteDepartment(id) {
        const index = this.departments.findIndex(d => d.id === id);
        if (index !== -1) {
            this.departments.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }
    getAllJobTitles() {
        return this.jobTitles;
    }
    createJobTitle(title) {
        const jobTitle = {
            id: this.jobTitleIdCounter++,
            title,
            createdAt: new Date().toISOString(),
        };
        this.jobTitles.push(jobTitle);
        this.saveToStorage();
        return jobTitle;
    }
    deleteJobTitle(id) {
        const index = this.jobTitles.findIndex(j => j.id === id);
        if (index !== -1) {
            this.jobTitles.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }
    getCompanySettings() {
        return this.companySettings;
    }
    updateCompanySettings(settings) {
        if (this.companySettings) {
            this.companySettings = Object.assign(Object.assign({}, this.companySettings), settings);
        }
        else {
            this.companySettings = Object.assign({ id: 1, companyName: settings.companyName || 'الشركة' }, settings);
        }
        this.saveToStorage();
        return this.companySettings;
    }
}
exports.InMemoryDatabase = InMemoryDatabase;
//# sourceMappingURL=in-memory-db.js.map