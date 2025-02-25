import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface JwtPayload {
    id: string;
    sub: string;
    email: string;
    tenantId: string;
    role: string[];
}

interface CustomRequest extends Request {
    user?: JwtPayload;
    tenantId: string;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {

    use(req: CustomRequest, res: Response, next: NextFunction) {

        const tenantId = req.headers['x-tenant-subdomain'] as string

        if (!tenantId) {
            throw new UnauthorizedException('Tenant no proporcionado en la cabecera');
        }

        req.headers['tenant-id'] = tenantId;  // add TenatId to headers
        req.tenantId = tenantId; // add TenatId to req
        next();
    }
}
