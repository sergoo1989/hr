import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // الحصول على إشعارات المستخدم الحالي
  @Get()
  getUserNotifications(@Request() req) {
    return this.notificationsService.getUserNotifications(req.user.userId);
  }

  // الحصول على الإشعارات غير المقروءة
  @Get('unread')
  getUnreadNotifications(@Request() req) {
    return this.notificationsService.getUnreadNotifications(req.user.userId);
  }

  // عدد الإشعارات غير المقروءة
  @Get('unread/count')
  getUnreadCount(@Request() req) {
    const count = this.notificationsService.getUnreadCount(req.user.userId);
    return { count };
  }

  // تحديد إشعار كمقروء
  @Post(':id/read')
  markAsRead(@Param('id') id: string) {
    this.notificationsService.markAsRead(+id);
    return { message: 'تم تحديد الإشعار كمقروء' };
  }

  // تحديد جميع الإشعارات كمقروءة
  @Post('read-all')
  markAllAsRead(@Request() req) {
    this.notificationsService.markAllAsRead(req.user.userId);
    return { message: 'تم تحديد جميع الإشعارات كمقروءة' };
  }

  // حذف إشعار
  @Delete(':id')
  deleteNotification(@Param('id') id: string) {
    this.notificationsService.deleteNotification(+id);
    return { message: 'تم حذف الإشعار' };
  }
}
