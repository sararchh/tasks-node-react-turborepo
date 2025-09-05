import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('auth.register')
  async register(@Payload() registerDto: RegisterDto) {
    return this.appService.register(registerDto);
  }

  @MessagePattern('auth.login')
  async login(@Payload() loginDto: LoginDto) {
    return this.appService.login(loginDto);
  }

  @MessagePattern('auth.refresh')
  async refreshToken(@Payload() refreshTokenDto: RefreshTokenDto) {
    return this.appService.refreshToken(refreshTokenDto.refreshToken);
  }

  @MessagePattern('auth.validate')
  async validateUser(@Payload() data: { userId: string }) {
    return this.appService.validateUser(data.userId);
  }

  @MessagePattern('auth.getUsers')
  async getUsers() {
    return this.appService.getUsers();
  }
}
