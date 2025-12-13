import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('company-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Get()
  @Roles('HR', 'ADMIN')
  async getSettings() {
    return this.service.getSettings();
  }

  @Put()
  @Roles('ADMIN')
  async updateSettings(@Body() dto: any) {
    return this.service.updateSettings(dto);
  }
}