import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto, UpdateGoalDto } from './dto';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('goals')
export class GoalsController {
  constructor(private service: GoalsService) {}

  @Get()
  list(@Req() req: any) {
    return this.service.list(req.user.sub);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateGoalDto) {
    return this.service.create(req.user.sub, dto);
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateGoalDto) {
    const ok = await this.service.update(req.user.sub, id, dto);
    if (!ok) throw new NotFoundException();
    return { updated: true };
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const ok = await this.service.remove(req.user.sub, id);
    if (!ok) throw new NotFoundException();
    return { deleted: true };
  }
}
