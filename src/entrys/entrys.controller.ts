import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntrysService } from './entrys.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';

@Controller('entrys')
export class EntrysController {
  constructor(private readonly entrysService: EntrysService) {}

  @Post()
  create(@Body() createEntryDto: CreateEntryDto) {
    return this.entrysService.create(createEntryDto);
  }

  @Get()
  findAll() {
    return this.entrysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entrysService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntryDto: UpdateEntryDto) {
    return this.entrysService.update(+id, updateEntryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entrysService.remove(+id);
  }
}
