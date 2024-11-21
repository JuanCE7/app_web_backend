import { Controller, Post, Body, Req, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/user-login.dto';
import { Request } from 'express';
import { Auth } from './decorators/auth.decorator';
import { RegisterUserDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';

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

  @Post('verifyOtp')
  verifyOtp(
    @Body()
    verifyOtpDto: VerifyOtpDto,
  ) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Get('/passwordRecovery/:email')
  passwordRecovery(@Param('email') email: string) {
    return this.authService.passwordRecovery(email);
  }

  @Post('login')
  login(
    @Body()
    loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @Auth('Tester')
  profile(@Req() req: RequestWithUser) {
    return this.authService.profile({
      email: req.user.email,
      role: req.user.role,
    });
  }

  @Post('logout')
  async logout(@Req() req) {
    const token = req.headers.authorization;
    return this.authService.logout(token);
  }
}
