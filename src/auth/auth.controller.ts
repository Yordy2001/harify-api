import { Response } from 'express';
import { Body, Controller, Post, UseGuards, Request, Res, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './DTOS/create_user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req,
    @Res() response: Response): Promise<any> {

    const token = await this.authService.login(req.user);

    response.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 });

    return response.send({ token, status: HttpStatus.OK })
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.authService.register(createUserDto);
  }
}
