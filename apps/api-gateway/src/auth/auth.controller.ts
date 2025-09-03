import { Controller, Post, Body } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly httpService: HttpService) {}

  @Post('register')
  async register(@Body() body: any) {
    const response = await firstValueFrom(
      this.httpService.post('http://auth-service:3002/auth/register', body)
    );
    return response.data;
  }

  @Post('login')
  async login(@Body() body: any) {
    const response = await firstValueFrom(
      this.httpService.post('http://auth-service:3002/auth/login', body)
    );
    return response.data;
  }

  @Post('refresh')
  async refresh(@Body() body: any) {
    const response = await firstValueFrom(
      this.httpService.post('http://auth-service:3002/auth/refresh', body)
    );
    return response.data;
  }
}
