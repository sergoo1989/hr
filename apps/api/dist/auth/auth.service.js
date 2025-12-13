"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const in_memory_db_1 = require("../database/in-memory-db");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.db = in_memory_db_1.InMemoryDatabase.getInstance();
    }
    async register(username, password, role, employeeId) {
        const user = await this.db.createUser(username, password, role, employeeId);
        return { id: user.id, username: user.username, role: user.role };
    }
    async login(username, password) {
        const user = this.db.findUserByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('اسم المستخدم أو كلمة المرور غير صحيحة');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('الحساب غير مفعل. يرجى التحقق من بريدك الإلكتروني');
        }
        const employee = user.employeeId ? this.db.findEmployeeById(user.employeeId) : null;
        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role,
            employeeId: user.employeeId
        };
        return {
            access_token: this.jwtService.sign(payload),
            role: user.role,
            mustChangePassword: user.mustChangePassword,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                employee: employee,
            },
        };
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = this.db.findUserById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('المستخدم غير موجود');
        }
        if (!(await bcrypt.compare(oldPassword, user.password))) {
            throw new common_1.UnauthorizedException('كلمة المرور القديمة غير صحيحة');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        this.db.updateUserPassword(userId, hashedPassword);
        return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
    }
    async activateAccount(activationToken) {
        const user = this.db.findUserByActivationToken(activationToken);
        if (!user) {
            throw new common_1.UnauthorizedException('رمز التفعيل غير صحيح');
        }
        this.db.activateUser(user.id);
        return { success: true, message: 'تم تفعيل الحساب بنجاح' };
    }
    async validateUser(userId) {
        const user = this.db.findUserById(userId);
        if (!user)
            return null;
        const employee = user.employeeId ? this.db.findEmployeeById(user.employeeId) : null;
        return Object.assign(Object.assign({}, user), { employee });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map