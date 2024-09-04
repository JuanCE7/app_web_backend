import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { UsecasesModule } from './usecases/usecases.module';
import { TestcasesModule } from './testcases/testcases.module';
import { StepsModule } from './steps/steps.module';
import { PermissionsModule } from './permissions/permissions.module';
import { EntrysModule } from './entrys/entrys.module';

@Module({
  imports: [ProjectsModule, UsersModule, UsecasesModule, TestcasesModule, StepsModule, PermissionsModule, EntrysModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
