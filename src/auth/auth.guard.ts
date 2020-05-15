import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TokenGuard } from './token.guard';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtAuthGuard: JwtAuthGuard, private tokenGuard: TokenGuard){

  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    
    return await this.jwtAuthGuard.canActivate(context) && await this.tokenGuard.canActivate(context);


  }
}
