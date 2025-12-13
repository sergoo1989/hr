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
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        employee: employee,
      },
    };
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
