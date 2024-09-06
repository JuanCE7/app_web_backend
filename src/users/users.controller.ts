import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary : 'Created a user'})
  @ApiResponse({status: 200, description : 'A user has been successfully created'})
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary : 'Get users'})
  @ApiResponse({status: 200, description : 'The users haS been successfully returned'})
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary : 'Get a user'})
  @ApiResponse({status: 200, description : 'A user has been successfully returned'})
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary : 'Update a user'})
  @ApiResponse({status: 200, description : 'A user has been successfully updated'})
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary : 'Delete a user'})
  @ApiResponse({status: 200, description : 'A user has been successfully deleted '})
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
