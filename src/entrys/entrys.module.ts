import { Module } from '@nestjs/common';
import { EntrysService } from './entrys.service';
import { EntrysController } from './entrys.controller';

@Module({
  controllers: [EntrysController],
  providers: [EntrysService],
})
export class EntrysModule {}
