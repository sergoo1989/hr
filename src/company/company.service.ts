import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CompanyService {
  private prisma = new PrismaClient();
  private DEFAULT_ID = 'default-company';

  async getSettings() {
    return this.prisma.companySetting.findFirst();
  }

  async updateSettings(dto: any) {
    return this.prisma.companySetting.upsert({
      where: { id: this.DEFAULT_ID },
      update: {
        name: dto.name,
        logoUrl: dto.logoUrl,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        payrollSignerHR: dto.payrollSignerHR,
        payrollSignerFinance: dto.payrollSignerFinance,
        payrollSignerCEO: dto.payrollSignerCEO,
        themePrimary: dto.themePrimary,
        themeSecondary: dto.themeSecondary,
      },
      create: {
        id: this.DEFAULT_ID,
        name: dto.name ?? 'الشركة',
        logoUrl: dto.logoUrl,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        payrollSignerHR: dto.payrollSignerHR,
        payrollSignerFinance: dto.payrollSignerFinance,
        payrollSignerCEO: dto.payrollSignerCEO,
        themePrimary: dto.themePrimary ?? '#006F45',
        themeSecondary: dto.themeSecondary ?? '#BFA86B',
      },
    });
  }
}