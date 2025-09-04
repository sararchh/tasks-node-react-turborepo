import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('auth-login')
  async login(@Payload() credential: { username: string; password: string }) {
    return this.appService.login(credential);
  }
}
