import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { PrismaService } from './prisma/prisma.service';
import { UsecasesModule } from './usecases/usecases.module';
import { TestcasesModule } from './testcases/testcases.module';
import { StepsModule } from './steps/steps.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IaModule } from './ia/ia.module';

@Module({
  imports: [
    ProjectsModule,
    UsecasesModule,
    TestcasesModule,
    StepsModule,
    PermissionsModule,
    AuthModule,
    UsersModule,
    IaModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
