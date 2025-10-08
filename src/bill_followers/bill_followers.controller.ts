import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BillFollowersService } from './bill_followers.service';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@ApiTags('Bill-followers')
@UseGuards(AuthGuard('jwt'))
@Controller('bill-followers')
export class BillFollowersController {
  constructor(private readonly service: BillFollowersService) {}

  // ติดตามบิล
  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'ติดตามบิล' })
  @Post(':billId/follow')
  public async follow(
    @Param('billId', ParseIntPipe) billId: number,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.service.follow(billId, userId);
  }

  // เลิกติดตาม
  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'เลิกติดตามบิล' })
  @Delete(':billId/follow')
  public async unfollow(
    @Param('billId', ParseIntPipe) billId: number,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.service.unfollow(billId, userId);
  }

  // กำลังติดตามอยู่ไหม
  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'ตรวจสอบกำลังติดตามอยู่หรือไม่' })
  @Get(':billId/is-following')
  public async isFollowing(
    @Param('billId', ParseIntPipe) billId: number,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.service.isFollowing(billId, userId);
  }

  // รายการบิลที่ฉันติดตาม
  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'รายการบิลที่ฉันติดตาม' })
  @Get('bill/list')
  public async listBill(@Req() req: any) {
    const userId = req.user?.id;
    return this.service.listMyFollowing(userId);
  }

  // รายชื่อผู้ติดตามของบิล
  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'รายชื่อผู้ติดตามของบิล' })
  @Get(':billId/followers')
  public async listFollowers(@Param('billId', ParseIntPipe) billId: number) {
    return this.service.listFollowersOfBill(billId);
  }
}
