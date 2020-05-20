import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
// import { redisClient } from '../shared/redis.db';
import * as jwt_decode from 'jwt-decode';
import { UserInfoService } from '../userinfo/userinfo.service';

@Injectable()
export class TokenGuard implements CanActivate {
	constructor(@Inject('UserInfoService')  private userInfoService: UserInfoService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		return new Promise(async (resolve, reject) => {
			if (!request.headers.authorization) {
				return resolve(false);
			}

			let token = request.headers.authorization.split(' ')[1];
			let decodedtoken = jwt_decode(token);

			// check token from redis
			// return redisClient.get(decodedtoken.sub, (error, data) => {
			//   if (error) throw error;
			//   if (data != null) {
			//     // console.log('Data present', data);
			//     // console.log('Token present', token);
			//     if (data == token) {
			//       // console.log('Not allowed');
			//       return resolve(false);
			//     } else {
			//       return resolve(true);
			//     }
			//   } else {
			//     // console.log('Not present');
			//     return resolve(true);
			//   }
			// });

			// check token from postgres
			let userInfo = await this.userInfoService.getUserInfo(decodedtoken.sub);
			if (userInfo) {
				if (userInfo.token == token) {
					return resolve(false);
				} else {
					return resolve(true);
				}
			} else {
        return resolve(true);
			}

		});
	}
}
