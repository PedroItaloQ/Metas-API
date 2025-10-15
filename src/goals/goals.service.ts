import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto, UpdateGoalDto } from './dto';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(userId: string, dto: CreateGoalDto) {
    return this.prisma.goal.create({
      data: { ...dto, userId },
    });
  }

  async update(userId: string, id: string, dto: UpdateGoalDto): Promise<boolean> {
    const res = await this.prisma.goal.updateMany({
      where: { id, userId },
      data: { ...dto },
    });
    return res.count === 1;
  }

  async remove(userId: string, id: string): Promise<boolean> {
    const res = await this.prisma.goal.deleteMany({
      where: { id, userId },
    });
    return res.count === 1;
  }
}
