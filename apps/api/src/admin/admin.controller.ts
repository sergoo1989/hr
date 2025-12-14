import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('leaves/pending')
  async getPendingLeaves() {
    return this.adminService.getPendingLeaves();
  }

  @Get('leaves')
  async getAllLeaves() {
    return this.adminService.getAllLeaves();
  }

  @Patch('leaves/:id/approve')
  async approveLeave(@Param('id') id: string) {
    return this.adminService.updateLeaveStatus(parseInt(id), 'APPROVED');
  }

  @Patch('leaves/:id/reject')
  async rejectLeave(@Param('id') id: string) {
    return this.adminService.updateLeaveStatus(parseInt(id), 'REJECTED');
  }

  @Get('advances/pending')
  async getPendingAdvances() {
    return this.adminService.getPendingAdvances();
  }

  @Get('advances')
  async getAllAdvances() {
    return this.adminService.getAllAdvances();
  }

  @Patch('advances/:id/approve')
  async approveAdvance(@Param('id') id: string) {
    return this.adminService.updateAdvanceStatus(parseInt(id), 'APPROVED');
  }

  @Patch('advances/:id/reject')
  async rejectAdvance(@Param('id') id: string) {
    return this.adminService.updateAdvanceStatus(parseInt(id), 'REJECTED');
  }

  @Post('employees/:id/resend-activation')
  async resendActivationEmail(@Param('id') id: string) {
    return this.adminService.resendActivationEmail(parseInt(id));
  }

  @Post('contracts')
  async createContract(@Body() contractData: any) {
    return this.adminService.createContract(contractData);
  }

  @Put('contracts/:id')
  async updateContract(@Param('id') id: string, @Body() contractData: any) {
    return this.adminService.updateContract(parseInt(id), contractData);
  }

  @Post('attendance')
  async recordAttendance(@Body() attendanceData: any) {
    return this.adminService.recordAttendance(attendanceData);
  }

  @Get('assets')
  async getAllAssets() {
    return this.adminService.getAllAssets();
  }

  @Post('assets/assign')
  async assignAsset(@Body() assetData: any) {
    return this.adminService.assignAsset(assetData);
  }

  @Patch('assets/:id/return')
  async returnAsset(@Param('id') id: string) {
    return this.adminService.returnAsset(parseInt(id));
  }

  @Delete('assets/:id')
  async deleteAsset(@Param('id') id: string) {
    return this.adminService.deleteAsset(parseInt(id));
  }

  @Post('documents')
  async addDocument(@Body() documentData: any) {
    return this.adminService.addDocument(documentData);
  }

  @Get('documents/expiring')
  async getExpiringDocuments() {
    return this.adminService.getExpiringDocuments();
  }

  @Post('travel-tickets')
  async issueTravelTicket(@Body() ticketData: any) {
    return this.adminService.issueTravelTicket(ticketData);
  }

  @Get('employees/:id/entitlements')
  async calculateEntitlements(@Param('id') id: string) {
    return this.adminService.calculateEmployeeEntitlements(parseInt(id));
  }

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsersWithPasswords();
  }

  @Post('users')
  async createUser(@Body() userData: any) {
    return this.adminService.createUser(userData);
  }

  @Patch('users/:id/password')
  async changeUserPassword(@Param('id') id: string, @Body() body: { password: string }) {
    return this.adminService.changeUserPassword(parseInt(id), body.password);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(parseInt(id));
  }
}
