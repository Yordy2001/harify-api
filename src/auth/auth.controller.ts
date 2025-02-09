import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto } from './DTOS/create_user.dto';
import { AuthService } from './auth.service';
// import { LoginUserDto } from './DTOS/login_user.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<any> {
    return await this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.authService.register(createUserDto);
  }
}
