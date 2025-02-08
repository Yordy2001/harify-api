import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './DTOS/create_user.dto';
import { LoginUserDto } from './DTOS/login_user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async login({ email, password }: LoginUserDto) {
    const user = await this.userRepository.findOneBy({ email })

    if (!user) return new HttpException('', HttpStatus.NOT_FOUND)

    const checkPassword = await compare(password, user.password);

    if (!checkPassword) return new HttpException('', HttpStatus.FORBIDDEN)

    const payload = { id: user.id, email: user.email }
    const token = await this.jwtService.sign(payload)
    const data = { token }
    return data;

  }

  async register(userData: CreateUserDto): Promise<any> {
    const saltOrRounds = 10;
    const hashedPassword = await hash(userData.password, saltOrRounds);
    return this.userRepository.save({
      ...userData,
      password: hashedPassword,
    });
  }
}
