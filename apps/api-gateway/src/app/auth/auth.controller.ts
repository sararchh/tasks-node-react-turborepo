import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Get('test')
  test() {
    return { message: 'Auth controller is working!' };
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return await firstValueFrom(this.authClient.send('auth-login', body));
  }
}
