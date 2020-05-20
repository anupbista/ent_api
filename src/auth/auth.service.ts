import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../user/user.dto';
import * as bcrypt from 'bcryptjs';
// import { redisClient } from '../shared/redis.db';
import * as jwt_decode from 'jwt-decode';
import { UserInfoService } from '../userinfo/userinfo.service';

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private userInfoService: UserInfoService) {}

	private async validate(userData: any): Promise<UserDTO> {
		return await this.userService.getUserPass(userData.username);
	}

	public async login(user: any): Promise<any> {
		return this.validate(user).then(async (userData: any) => {
			if (!userData) {
				throw new HttpException('Not found', HttpStatus.NOT_FOUND);
			} else if (!await this.comparePassword(user.password, userData.password)) {
				throw new UnauthorizedException();
			} else {
				// delete the expired token associated with this user
				let userInfo = await this.userInfoService.getUserInfo(userData.id);
				if(userInfo){
					let decodedtoken = jwt_decode(userInfo.token);
					let exp_date = decodedtoken.exp;
					let d = new Date();
					let now_sec = (d.getTime() - d.getMilliseconds()) / 1000;
					if(now_sec > exp_date){
						await this.userInfoService.deleteUserInfo(userData.id);
					}
				}
				const payload = { username: userData.username, sub: userData.id };
				const accessToken = this.jwtService.sign(payload, {
					expiresIn: '60m'
				});

				return {
					expires_in: 3600,
					access_token: accessToken,
					userid: payload.sub
				};
			}
		});
	}

	async logout(id: string, token) {
		let decodedtoken = jwt_decode(token);
		let exp_date = decodedtoken.exp;

		let d = new Date();
		let now_sec = (d.getTime() - d.getMilliseconds()) / 1000;

		//set to redis
		// if(exp_date-now_sec > 0){
		//   redisClient.setex(id, (exp_date-now_sec) , token);
		// }
		// return { logout: true };

		// save to postgres db
		if (exp_date - now_sec > 0) {
			await this.userInfoService.saveUserInfo({
				userid: id,
				token: token
			})
			return { logout: true };
		}
	}

	async comparePassword(attempt: string, password: string): Promise<boolean> {
		return await bcrypt.compare(attempt, password);
	}
}
