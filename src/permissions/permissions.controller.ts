import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiOperation({ summary : 'Created a permission'})
  @ApiResponse({status: 200, description : 'A permission has been successfully created'})
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary : 'Get permissions'})
  @ApiResponse({status: 200, description : 'The permissions haS been successfully returned'})
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary : 'Get a permission'})
  @ApiResponse({status: 200, description : 'A permission has been successfully returned'})
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary : 'Update a permission'})
  @ApiResponse({status: 200, description : 'A permission has been successfully updated'})
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary : 'Delete a permission'})
  @ApiResponse({status: 200, description : 'A permission has been successfully deleted '})
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
