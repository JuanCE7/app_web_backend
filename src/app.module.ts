import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { PrismaService } from './prisma/prisma.service';
import { UsecasesModule } from './usecases/usecases.module';
import { TestcasesModule } from './testcases/testcases.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IaModule } from './ia/ia.module';
import { ExplanationModule } from './explanation/explanation.module';

@Module({
  imports: [
    ProjectsModule,
    UsecasesModule,
    TestcasesModule,
    AuthModule,
    UsersModule,
    IaModule,
    ExplanationModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
