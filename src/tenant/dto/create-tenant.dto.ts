import { IUSer } from "src/auth/interface/user.interface";

export class CreateTenantDto {
    name: string;
    logo: string;
    subdomain: string;
    colors: Record<string, string>;
    adminData: IUSer;
}
