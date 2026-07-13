import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Liveness probe ligero: no toca la BD, responde de inmediato.
   * Usado por el frontend para detectar si el servidor está despierto
   * y por el keep-alive básico.
   */
  @Get()
  check() {
    return {
      status: 'ok',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness probe: verifica la conexión a la base de datos con un
   * SELECT 1. Además "toca" la BD para evitar que se pause por inactividad
   * (útil para el cron de keep-alive apuntando aquí).
   */
  @Get('db')
  async checkDb() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', db: 'ok', timestamp: new Date().toISOString() };
    } catch (error) {
      return { status: 'degraded', db: 'down', timestamp: new Date().toISOString() };
    }
  }
}
