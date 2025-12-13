import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InMemoryDatabase } from '../database/in-memory-db';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private db = InMemoryDatabase.getInstance();

  constructor(private jwtService: JwtService) {}

  async register(username: string, password: string, role: string, employeeId?: number) {
    const user = await this.db.createUser(username, password, role as 'ADMIN' | 'EMPLOYEE', employeeId);
    return { id: user.id, username: user.username, role: user.role };
  }

  async login(username: string, password: string) {
    const user = this.db.findUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('اسم المستخدم أو كلمة المرور غير صحيحة');
    }

    // التحقق من أن الحساب مفعل
    if (!user.isActive) {
      throw new UnauthorizedException('الحساب غير مفعل. يرجى التحقق من بريدك الإلكتروني');
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
      mustChangePassword: user.mustChangePassword, // إضافة حالة تغيير كلمة المرور
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        employee: employee,
      },
    };
  }

  /**
   * تغيير كلمة المرور (إلزامي للموظفين الجدد)
   */
  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = this.db.findUserById(userId);
    
    if (!user) {
      throw new UnauthorizedException('المستخدم غير موجود');
    }

    // التحقق من كلمة المرور القديمة
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new UnauthorizedException('كلمة المرور القديمة غير صحيحة');
    }

    // تحديث كلمة المرور
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    this.db.updateUserPassword(userId, hashedPassword);

    return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
  }

  /**
   * تفعيل حساب موظف جديد
   */
  async activateAccount(activationToken: string) {
    const user = this.db.findUserByActivationToken(activationToken);
    
    if (!user) {
      throw new UnauthorizedException('رمز التفعيل غير صحيح');
    }

    this.db.activateUser(user.id);

    return { success: true, message: 'تم تفعيل الحساب بنجاح' };
  }

  async validateUser(userId: number) {
    const user = this.db.findUserById(userId);
    if (!user) return null;

    const employee = user.employeeId ? this.db.findEmployeeById(user.employeeId) : null;
    
    return {
      ...user,
      employee,
    };
  }
}
