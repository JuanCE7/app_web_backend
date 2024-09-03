import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ProjectsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
