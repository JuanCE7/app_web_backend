import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { RegisterUserDto } from '../auth/dto/register.dto';
import { LoginDto } from '../auth/dto/user-login.dto';
import { VerifyOtpDto } from '../auth/dto/verifyOtp.dto';
import { JwtModule } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn((dto) => ({ ...dto, id: 1 })),
    verifyOtp: jest.fn(() => ({ success: true })),
    passwordRecovery: jest.fn((email) => ({ email, status: 'email sent' })),
    login: jest.fn(() => ({ accessToken: 'fake-jwt-token' })),
    profile: jest.fn((user) => ({ ...user, profile: 'user-profile' })),
    logout: jest.fn(() => ({ success: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
      imports: [
        JwtModule.register({
          secret: 'secretKey',
          signOptions: { expiresIn: '60s' },
        }),
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const registerDto: RegisterUserDto = {
        firstName: 'test',
        lastName: 'test',
        email: 'test@example.com',
        password: '12345',
      };
      const result = await authController.register(registerDto);
      expect(result).toEqual({ ...registerDto, id: 1 });
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('verifyOtp', () => {
    it('should verify OTP', async () => {
      const verifyOtpDto: VerifyOtpDto = {
        token: 'tasfasfe124198yuw9d1n2d1',
        enteredOtp: '123456',
      };
      const result = await authController.verifyOtp(verifyOtpDto);
      expect(result).toEqual({ success: true });
      expect(authService.verifyOtp).toHaveBeenCalledWith(verifyOtpDto);
    });
  });

  describe('passwordRecovery', () => {
    it('should send password recovery email', async () => {
      const email = 'test@example.com';
      const result = await authController.passwordRecovery(email);
      expect(result).toEqual({ email, status: 'email sent' });
      expect(authService.passwordRecovery).toHaveBeenCalledWith(email);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const loginDto: LoginDto = { email: '@example.com', password: '12345' };
      const result = await authController.login(loginDto);
      expect(result).toEqual({ accessToken: 'fake-jwt-token' });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw an error for incorrect credentials', async () => {
      const loginDto: LoginDto = {
        email: 'incorrect@example.com',
        password: 'wrongpassword',
      };
      jest
        .spyOn(authService, 'login')
        .mockRejectedValueOnce(
          new UnauthorizedException(
            'No se encontró una cuenta con ese correo electrónico',
          ),
        );
      try {
        await authController.login(loginDto);
      } catch (error) {
        expect(error.response).toEqual({
          message: 'No se encontró una cuenta con ese correo electrónico',
          error: 'Unauthorized',
          statusCode: 401,
        });
        expect(error.status).toEqual(401);
      }
    });
  });

  describe('logout', () => {
    it('should log out the user', async () => {
      const req = { headers: { authorization: 'Bearer fake-token' } } as any;
      const result = await authController.logout(req);
      expect(result).toEqual({ success: true });
      expect(authService.logout).toHaveBeenCalledWith('Bearer fake-token');
    });
  });
});
