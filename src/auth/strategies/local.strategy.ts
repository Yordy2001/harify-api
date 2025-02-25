import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";



@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService) {
        super({ usernameField: 'email', passwordField: 'password', passReqToCallback: true, });
    }

    async validate(req: Request, email: string, password: string): Promise<any> {
        const tenantId = req.headers['x-tenant-subdomain'] as string;

        if (!tenantId) {
            throw new HttpException('No se encontró el Tenant', HttpStatus.NOT_FOUND);
        }

        const user = await this.authService.validateUser(email, password, tenantId)

        if (!user) {
            throw new HttpException('Credential Incorrect', HttpStatus.NOT_FOUND)
        }

        return user;
    }
}
