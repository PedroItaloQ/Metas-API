import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto';
import { ConfigService } from '@nestjs/config';

type JwtTtl = `${number}${'s' | 'm' | 'h' | 'd'}`; // ex.: "15m", "7d"

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: AuthDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email já usado');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hash },
    });

    return this.signTokens(user.id, user.email);
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas');

    return this.signTokens(user.id, user.email);
  }

  private async signTokens(sub: string, email: string) {
    const accessTtl = (this.config.get<string>('JWT_EXPIRES') ?? '15m') as JwtTtl;
    const refreshTtl = (this.config.get<string>('JWT_REFRESH_EXPIRES') ?? '7d') as JwtTtl;

    const accessToken = await this.jwt.signAsync(
      { sub, email },
      {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
        expiresIn: accessTtl, // tipado como JwtTtl → sem erro
      },
    );

    const refreshToken = await this.jwt.signAsync(
      { sub, email, type: 'refresh' },
      {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshTtl,
      },
    );

    return { accessToken, refreshToken };
  }
}
