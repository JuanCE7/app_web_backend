import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/user-login.dto';
import { Request } from 'express';
import { UserType } from '@prisma/client';
import { Auth } from './decorators/auth.decorator';

interface RequestWithUser extends Request {
  user: { email: string; userType: string };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body()
    registerDto: CreateUserDto,
  ) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(
    @Body()
    loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @Auth(UserType.Dev) 
  profile(@Req() req: RequestWithUser) {
    return this.authService.profile({
      email: req.user.email,
      userType: req.user.userType,
    })
  }
}