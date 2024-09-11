import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @Roles('Admin')  // Solo los Admins pueden actualizar usuarios
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('Admin')  // Solo los Admins pueden eliminar usuarios
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
