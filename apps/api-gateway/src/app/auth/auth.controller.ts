import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { firstValueFrom } from 'rxjs';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'sara@mail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Username',
    example: 'sara',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    description: 'User password',
    example: '123456',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

class LoginDto {
  @ApiProperty({
    description: 'Username or email address',
    example: 'sara@mail.com',
  })
  @IsString()
  usernameOrEmail: string;

  @ApiProperty({
    description: 'User password',
    example: '123456',
  })
  @IsString()
  password: string;
}

class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  refreshToken: string;
}

@ApiTags('Authentication')
@Controller('auth')
@Throttle({ default: { limit: 10, ttl: 1000 } }) // 10 requests per second
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        tokenType: { type: 'string' },
        expiresIn: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return await firstValueFrom(
      this.authClient.send('auth.register', registerDto),
    );
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        tokenType: { type: 'string' },
        expiresIn: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await firstValueFrom(this.authClient.send('auth.login', loginDto));
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token successfully refreshed',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        tokenType: { type: 'string' },
        expiresIn: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return await firstValueFrom(
      this.authClient.send('auth.refresh', refreshTokenDto),
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        username: { type: 'string' },
        createdAt: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    return await firstValueFrom(
      this.authClient.send('auth.validate', { userId: req.user.sub }),
    );
  }
}
