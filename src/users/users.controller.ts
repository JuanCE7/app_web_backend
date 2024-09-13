import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary : 'Created a user'})
  @ApiResponse({status: 200, description : 'A user has been successfully created'})
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({ summary : 'Get users'})
  @ApiResponse({status: 200, description : 'The users has been successfully returned'})
  async findAll() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  @ApiOperation({ summary : 'Get a user'})
  @ApiResponse({status: 200, description : 'A user has been successfully returned'})
  async findOne(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary : 'Update a user'})
  @ApiResponse({status: 200, description : 'A user has been successfully updated'})
  @Roles('Admin')  // Solo los Admins pueden actualizar usuarios
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary : 'Delete a user'})
  @ApiResponse({status: 200, description : 'A user has been successfully deleted '})
  @Roles('Admin')  // Solo los Admins pueden eliminar usuarios
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
