import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  login(credential: { username: string; password: string }) {
    const { username, password } = credential;

    return username;
  }

  getData(): { message: string } {
    return { message: 'Welcome to auth-service!' };
  }
}
