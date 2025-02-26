import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService
  ){}

  canActivate( context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.token;
    
    if(!token) throw new UnauthorizedException('No estás autenticado')

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado')
    }
  }
}
