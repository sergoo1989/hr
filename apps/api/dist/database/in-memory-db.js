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
        this.attendances = [];
        this.payrollRecords = [];
        this.notifications = [];
        this.userIdCounter = 1;
        this.employeeIdCounter = 1;
        this.leaveIdCounter = 1;
        this.advanceIdCounter = 1;
        this.assetIdCounter = 1;
        this.departmentIdCounter = 1;
        this.jobTitleIdCounter = 1;
        this.attendanceIdCounter = 1;
        this.payrollRecordIdCounter = 1;
        this.notificationIdCounter = 1;
        this.storage = data_storage_1.DataStorage.getInstance();
        this.loadFromStorage();
        this.seedInitialData();
        setInterval(() => {
            this.saveToStorage();
            console.log('🔄 حفظ تلقائي للبيانات - ' + new Date().toLocaleTimeString('ar-SA'));
        }, 30000);
        process.on('SIGINT', () => {
            console.log('\n⚠️ جاري إيقاف السيرفر...');
            this.saveToStorage();
            console.log('✅ تم حفظ البيانات بنجاح قبل الإغلاق');
            process.exit(0);
        });
        process.on('SIGTERM', () => {
            console.log('\n⚠️ جاري إيقاف السيرفر...');
            this.saveToStorage();
            console.log('✅ تم حفظ البيانات بنجاح قبل الإغلاق');
            process.exit(0);
        });
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
            this.attendances = data.attendances || [];
            this.payrollRecords = data.payrollRecords || [];
            this.notifications = data.notifications || [];
            this.userIdCounter = data.userIdCounter || 1;
            this.employeeIdCounter = data.employeeIdCounter || 1;
            this.leaveIdCounter = data.leaveIdCounter || 1;
            this.advanceIdCounter = data.advanceIdCounter || 1;
            this.assetIdCounter = data.assetIdCounter || 1;
            this.departmentIdCounter = data.departmentIdCounter || 1;
            this.jobTitleIdCounter = data.jobTitleIdCounter || 1;
            this.attendanceIdCounter = data.attendanceIdCounter || 1;
            this.payrollRecordIdCounter = data.payrollRecordIdCounter || 1;
            this.notificationIdCounter = data.notificationIdCounter || 1;
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
            attendances: this.attendances,
            payrollRecords: this.payrollRecords,
            notifications: this.notifications,
            userIdCounter: this.userIdCounter,
            employeeIdCounter: this.employeeIdCounter,
            leaveIdCounter: this.leaveIdCounter,
            advanceIdCounter: this.advanceIdCounter,
            assetIdCounter: this.assetIdCounter,
            departmentIdCounter: this.departmentIdCounter,
            jobTitleIdCounter: this.jobTitleIdCounter,
            attendanceIdCounter: this.attendanceIdCounter,
            payrollRecordIdCounter: this.payrollRecordIdCounter,
            notificationIdCounter: this.notificationIdCounter,
        };
        this.storage.saveData(data);
    }
    getAllData() {
        return {
            users: this.users,
            employees: this.employees,
            leaves: this.leaves,
            advances: this.advances,
            assets: this.assets,
            departments: this.departments,
            jobTitles: this.jobTitles,
            companySettings: this.companySettings,
            attendances: this.attendances,
            payrollRecords: this.payrollRecords,
            notifications: this.notifications,
            counters: {
                userIdCounter: this.userIdCounter,
                employeeIdCounter: this.employeeIdCounter,
                leaveIdCounter: this.leaveIdCounter,
                advanceIdCounter: this.advanceIdCounter,
                assetIdCounter: this.assetIdCounter,
                departmentIdCounter: this.departmentIdCounter,
                jobTitleIdCounter: this.jobTitleIdCounter,
                attendanceIdCounter: this.attendanceIdCounter,
                payrollRecordIdCounter: this.payrollRecordIdCounter,
                notificationIdCounter: this.notificationIdCounter,
            }
        };
    }
    loadFromBackup(backupData) {
        try {
            this.users = backupData.users || [];
            this.employees = backupData.employees || [];
            this.leaves = backupData.leaves || [];
            this.advances = backupData.advances || [];
            this.assets = backupData.assets || [];
            this.departments = backupData.departments || [];
            this.jobTitles = backupData.jobTitles || [];
            this.companySettings = backupData.companySettings || this.companySettings;
            this.attendances = backupData.attendances || [];
            this.payrollRecords = backupData.payrollRecords || [];
            this.notifications = backupData.notifications || [];
            if (backupData.counters) {
                this.userIdCounter = backupData.counters.userIdCounter || this.userIdCounter;
                this.employeeIdCounter = backupData.counters.employeeIdCounter || this.employeeIdCounter;
                this.leaveIdCounter = backupData.counters.leaveIdCounter || this.leaveIdCounter;
                this.advanceIdCounter = backupData.counters.advanceIdCounter || this.advanceIdCounter;
                this.assetIdCounter = backupData.counters.assetIdCounter || this.assetIdCounter;
                this.departmentIdCounter = backupData.counters.departmentIdCounter || this.departmentIdCounter;
                this.jobTitleIdCounter = backupData.counters.jobTitleIdCounter || this.jobTitleIdCounter;
                this.attendanceIdCounter = backupData.counters.attendanceIdCounter || this.attendanceIdCounter;
                this.payrollRecordIdCounter = backupData.counters.payrollRecordIdCounter || this.payrollRecordIdCounter;
                this.notificationIdCounter = backupData.counters.notificationIdCounter || this.notificationIdCounter;
            }
            else {
                this.userIdCounter = backupData.userIdCounter || this.userIdCounter;
                this.employeeIdCounter = backupData.employeeIdCounter || this.employeeIdCounter;
                this.leaveIdCounter = backupData.leaveIdCounter || this.leaveIdCounter;
                this.advanceIdCounter = backupData.advanceIdCounter || this.advanceIdCounter;
                this.assetIdCounter = backupData.assetIdCounter || this.assetIdCounter;
                this.departmentIdCounter = backupData.departmentIdCounter || this.departmentIdCounter;
                this.jobTitleIdCounter = backupData.jobTitleIdCounter || this.jobTitleIdCounter;
                this.attendanceIdCounter = backupData.attendanceIdCounter || this.attendanceIdCounter;
                this.payrollRecordIdCounter = backupData.payrollRecordIdCounter || this.payrollRecordIdCounter;
                this.notificationIdCounter = backupData.notificationIdCounter || this.notificationIdCounter;
            }
            console.log('✅ تم استعادة البيانات بنجاح');
            return { success: true };
        }
        catch (error) {
            console.error('❌ فشل في استعادة البيانات:', error);
            throw error;
        }
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
    findAllUsers() {
        return this.users;
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
    deleteEmployee(id) {
        const index = this.employees.findIndex(e => e.id === id);
        if (index > -1) {
            this.employees.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }
    deleteUserByEmployeeId(employeeId) {
        const index = this.users.findIndex(u => u.employeeId === employeeId);
        if (index > -1) {
            this.users.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
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
    deleteLeave(id) {
        const index = this.leaves.findIndex(l => l.id === id);
        if (index > -1) {
            this.leaves.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
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
    deleteAdvance(id) {
        const index = this.advances.findIndex(a => a.id === id);
        if (index > -1) {
            this.advances.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
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
    updateDepartment(id, name) {
        const dept = this.departments.find(d => d.id === id);
        if (dept) {
            dept.name = name;
            this.saveToStorage();
            return dept;
        }
        return undefined;
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
    updateJobTitle(id, title) {
        const jobTitle = this.jobTitles.find(j => j.id === id);
        if (jobTitle) {
            jobTitle.title = title;
            this.saveToStorage();
            return jobTitle;
        }
        return undefined;
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
    createAttendance(attendanceData) {
        const attendance = {
            id: this.attendanceIdCounter++,
            employeeId: attendanceData.employeeId,
            date: attendanceData.date || new Date(),
            checkIn: attendanceData.checkIn,
            checkOut: attendanceData.checkOut,
            workHours: attendanceData.workHours,
            lateMinutes: attendanceData.lateMinutes || 0,
            overtimeHours: attendanceData.overtimeHours,
            earlyLeaveMinutes: attendanceData.earlyLeaveMinutes,
            status: attendanceData.status || 'PRESENT',
            notes: attendanceData.notes,
        };
        this.attendances.push(attendance);
        this.saveToStorage();
        return attendance;
    }
    getAttendanceById(id) {
        return this.attendances.find(a => a.id === id);
    }
    getAttendancesByEmployeeId(employeeId) {
        return this.attendances.filter(a => a.employeeId === employeeId);
    }
    getAttendanceByEmployeeAndDate(employeeId, date) {
        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);
        return this.attendances.find(a => {
            const attDate = new Date(a.date);
            attDate.setHours(0, 0, 0, 0);
            return a.employeeId === employeeId && attDate.getTime() === searchDate.getTime();
        });
    }
    getAllAttendances() {
        return this.attendances;
    }
    updateAttendance(id, updates) {
        const attendance = this.attendances.find(a => a.id === id);
        if (attendance) {
            Object.assign(attendance, updates);
            this.saveToStorage();
            return attendance;
        }
        return undefined;
    }
    deleteAttendance(id) {
        const index = this.attendances.findIndex(a => a.id === id);
        if (index !== -1) {
            this.attendances.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }
    createPayrollRecord(data) {
        const record = {
            id: this.payrollRecordIdCounter++,
            employeeId: data.employeeId,
            month: data.month,
            year: data.year,
            basicSalary: data.basicSalary || 0,
            housingAllowance: data.housingAllowance || 0,
            transportAllowance: data.transportAllowance || 0,
            totalAllowances: data.totalAllowances || 0,
            grossSalary: data.grossSalary || 0,
            presentDays: data.presentDays || 0,
            absentDays: data.absentDays || 0,
            lateDays: data.lateDays || 0,
            lateDeduction: data.lateDeduction || 0,
            absentDeduction: data.absentDeduction || 0,
            overtimeHours: data.overtimeHours || 0,
            overtimeAmount: data.overtimeAmount || 0,
            advanceDeduction: data.advanceDeduction || 0,
            gosiDeduction: data.gosiDeduction || 0,
            otherDeductions: data.otherDeductions || 0,
            totalDeductions: data.totalDeductions || 0,
            netSalary: data.netSalary || 0,
            status: data.status || 'DRAFT',
            paidDate: data.paidDate,
            notes: data.notes,
            createdAt: new Date(),
        };
        this.payrollRecords.push(record);
        this.saveToStorage();
        return record;
    }
    getPayrollRecordById(id) {
        return this.payrollRecords.find(p => p.id === id);
    }
    getPayrollRecordsByEmployee(employeeId) {
        return this.payrollRecords.filter(p => p.employeeId === employeeId);
    }
    getPayrollRecordByEmployeeAndPeriod(employeeId, month, year) {
        return this.payrollRecords.find(p => p.employeeId === employeeId && p.month === month && p.year === year);
    }
    getAllPayrollRecords() {
        return this.payrollRecords;
    }
    updatePayrollRecord(id, updates) {
        const record = this.payrollRecords.find(p => p.id === id);
        if (record) {
            Object.assign(record, updates);
            this.saveToStorage();
            return record;
        }
        return undefined;
    }
    deletePayrollRecord(id) {
        const index = this.payrollRecords.findIndex(p => p.id === id);
        if (index !== -1) {
            this.payrollRecords.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }
    createNotification(data) {
        const notification = {
            id: this.notificationIdCounter++,
            userId: data.userId,
            title: data.title,
            message: data.message,
            type: data.type || 'INFO',
            read: false,
            createdAt: new Date(),
            link: data.link,
        };
        this.notifications.push(notification);
        this.saveToStorage();
        return notification;
    }
    getNotificationsByUserId(userId) {
        return this.notifications.filter(n => n.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    getUnreadNotificationsByUserId(userId) {
        return this.notifications.filter(n => n.userId === userId && !n.read)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    markNotificationAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.saveToStorage();
            return true;
        }
        return false;
    }
    markAllNotificationsAsRead(userId) {
        const userNotifications = this.notifications.filter(n => n.userId === userId);
        userNotifications.forEach(n => n.read = true);
        this.saveToStorage();
        return true;
    }
    deleteNotification(id) {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            this.notifications.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }
}
exports.InMemoryDatabase = InMemoryDatabase;
//# sourceMappingURL=in-memory-db.js.map