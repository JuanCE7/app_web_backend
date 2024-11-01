import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/user-login.dto';
import { Request } from 'express';
import { Auth } from './decorators/auth.decorator';
import { RegisterUserDto } from './dto/register.dto';

interface RequestWithUser extends Request {
  user: { email: string; role: string };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body()
    registerDto: RegisterUserDto,
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
  @Auth("User") 
  profile(@Req() req: RequestWithUser) {
    return this.authService.profile({
      email: req.user.email,
      role: req.user.role,
    })
  }

  @Post('logout')
  async logout(@Req() req) {
    const token = req.headers.authorization;
    console.log(token)
    return this.authService.logout(token);
  }
}
