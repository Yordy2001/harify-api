import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface JwtPayload {
    id: string;
    sub: string;
    email: string;
    tenantId: string;
    role: string[];
}


@Injectable()
export class TenantMiddleware implements NestMiddleware {
    use(req: Request & { user?: JwtPayload }, res: Response, next: NextFunction) {
        if (!req.user || !req.user.tenantId) {
            throw new UnauthorizedException('No tienes un tenant asignado');
        }

        // add Tenat to headers
        req.headers['tenant-id'] = req.user.tenantId; 
        next();
    }
}