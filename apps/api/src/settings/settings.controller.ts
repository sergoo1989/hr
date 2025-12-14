import { Controller, Get, Post, Delete, Put, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  // Company Settings
  @Get('company')
  getCompanySettings() {
    return this.settingsService.getCompanySettings();
  }

  @Put('company')
  updateCompanySettings(@Body() settings: any) {
    return this.settingsService.updateCompanySettings(settings);
  }

  // Departments
  @Get('departments')
  getAllDepartments() {
    return this.settingsService.getAllDepartments();
  }

  @Post('departments')
  createDepartment(@Body() body: { name: string }) {
    console.log('📥 Received department creation request:', body);
    const result = this.settingsService.createDepartment(body.name);
    console.log('✅ Department created:', result);
    return result;
  }

  @Put('departments/:id')
  updateDepartment(@Param('id') id: string, @Body() body: { name: string }) {
    return this.settingsService.updateDepartment(parseInt(id), body.name);
  }

  @Delete('departments/:id')
  deleteDepartment(@Param('id') id: string) {
    return this.settingsService.deleteDepartment(parseInt(id));
  }

  // Job Titles
  @Get('job-titles')
  getAllJobTitles() {
    return this.settingsService.getAllJobTitles();
  }

  @Post('job-titles')
  createJobTitle(@Body() body: { title: string }) {
    console.log('📥 Received job title creation request:', body);
    const result = this.settingsService.createJobTitle(body.title);
    console.log('✅ Job title created:', result);
    return result;
  }

  @Put('job-titles/:id')
  updateJobTitle(@Param('id') id: string, @Body() body: { title: string }) {
    return this.settingsService.updateJobTitle(parseInt(id), body.title);
  }

  @Delete('job-titles/:id')
  deleteJobTitle(@Param('id') id: string) {
    return this.settingsService.deleteJobTitle(parseInt(id));
  }
}
