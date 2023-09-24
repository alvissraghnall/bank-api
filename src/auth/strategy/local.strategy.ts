import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {

    constructor(public readonly authService: AuthService) {
        super({
            usernameField: 'phoneNumber', 
            passwordField: 'password'
        });
    }

    async validate(phoneNumber: string, password: string) {
        console.log(phoneNumber, password);
        const user = await this.authService.validateUser(phoneNumber, password);
        
        return user;
    }
    
}