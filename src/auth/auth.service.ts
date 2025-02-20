import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './DTOS/create_user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async validateUser(email, password,): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['tenant'],
    });

    if (!user) return new HttpException('User not found', HttpStatus.NOT_FOUND)

    const checkPassword = await compare(password, user.password);

    if (!checkPassword) return new HttpException('', HttpStatus.FORBIDDEN)

    return user;
  }

  async register(userData: CreateUserDto): Promise<any> { 
    const user = await this.userRepository.findOne({
      where: { email: userData.email },
      relations: ['tenant']
    })
    console.log(user);
    
    if (user) return new HttpException('Email registrado en espacio de trabajo', HttpStatus.CONFLICT)

    const saltOrRounds = 10;

    const hashedPassword = await hash(userData.password, saltOrRounds);
    return this.userRepository.save({
      ...userData,
      password: hashedPassword,
    });
  }

  async login(user: User) {
    const payload = { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant.subdomain }
    const token = this.jwtService.sign(payload)
    return { token }
  }
}
