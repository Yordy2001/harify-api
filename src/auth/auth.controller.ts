import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './DTOS/create_user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './DTOS/login_user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return await this.authService.login(loginUserDto);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.authService.register(createUserDto);
  }
}
