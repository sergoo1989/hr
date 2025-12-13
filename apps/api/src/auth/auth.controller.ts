import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { username: string; password: string; role: string; employeeId?: number },
  ) {
    return this.authService.register(body.username, body.password, body.role, body.employeeId);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  /**
   * تغيير كلمة المرور
   */
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req,
    @Body() body: { oldPassword: string; newPassword: string }
  ) {
    return this.authService.changePassword(req.user.sub, body.oldPassword, body.newPassword);
  }

  /**
   * تفعيل الحساب باستخدام رمز التفعيل
   */
  @Get('activate/:token')
  async activateAccount(@Param('token') token: string) {
    return this.authService.activateAccount(token);
  }
}
