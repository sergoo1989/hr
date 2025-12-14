import { Controller, Get, Post, Body, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BackupService } from './backup.service';
import { Response } from 'express';

@Controller('backup')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  /**
   * GET /api/backup/download - تحميل نسخة احتياطية من البيانات
   */
  @Get('download')
  @Roles('admin')
  async downloadBackup(@Res() res: Response) {
    try {
      const backup = this.backupService.createBackup();
      
      const filename = `hr-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      return res.status(HttpStatus.OK).send(JSON.stringify(backup, null, 2));
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'فشل في إنشاء النسخة الاحتياطية',
        error: error.message
      });
    }
  }

  /**
   * POST /api/backup/restore - استعادة البيانات من نسخة احتياطية
   */
  @Post('restore')
  @Roles('admin')
  async restoreBackup(@Body() backupData: any) {
    try {
      const result = this.backupService.restoreBackup(backupData);
      
      return {
        success: true,
        message: 'تم استعادة البيانات بنجاح',
        stats: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'فشل في استعادة البيانات',
        error: error.message
      };
    }
  }

  /**
   * GET /api/backup/info - معلومات عن البيانات الحالية
   */
  @Get('info')
  @Roles('admin')
  getBackupInfo() {
    return this.backupService.getBackupInfo();
  }

  /**
   * POST /api/backup/auto-save - حفظ تلقائي
   */
  @Post('auto-save')
  @Roles('admin')
  async autoSave() {
    try {
      this.backupService.saveToFile();
      return {
        success: true,
        message: 'تم الحفظ بنجاح',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: 'فشل الحفظ',
        error: error.message
      };
    }
  }
}
