import { Injectable, HttpException, HttpStatus, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../user/user.dto';
import * as bcrypt from 'bcryptjs';
// import { redisClient } from '../shared/redis.db';
import * as jwt_decode from 'jwt-decode';
import { UserInfoService } from '../userinfo/userinfo.service';
import { AuthDTO } from './auth.dto';
import { PasswordChangeDTO } from './passwordchange.dto';
import { UserInfoDTO } from '../userinfo/userinfo.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private userInfoService: UserInfoService
	) {}

	private async validate(userData: any): Promise<UserDTO> {
		return await this.userService.getUserPass(userData.username);
	}

	public async login(user: AuthDTO): Promise<any> {
		return this.validate(user).then(async (userData: any) => {
			if (!userData) {
				throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
			} else if (!await this.comparePassword(user.password, userData.password)) {
				throw new UnauthorizedException();
			} else {
				// delete the expired token associated with this user
				let expiredToken = [];
				let userInfos: any = await this.userInfoService.getUserInfo(userData.id, null);
				if (userInfos) {
					userInfos.forEach((element) => {
						let decodedtoken = jwt_decode(element.token);
						let exp_date = decodedtoken.exp;
						let d = new Date();
						let now_sec = (d.getTime() - d.getMilliseconds()) / 1000;
						if (now_sec > exp_date) {
							expiredToken.push(element.id);
						}
					});
					if(expiredToken.length > 0) await this.userInfoService.deleteUserInfo(expiredToken);
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

	public async passwordChange(passwords: PasswordChangeDTO, id: string): Promise<any> {
		let user = await this.userService.getUserPassById(id);
		if (!await this.comparePassword(passwords.oldpassword, user.password)) {
			throw new ForbiddenException();
		} else {
			let newpass = await bcrypt.hash(passwords.newpassword || 'test', 10);
			return this.userService.updateUser(id, {
				password: newpass
			});
		}
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
			});
			return { logout: true };
		}
	}

	async comparePassword(attempt: string, password: string): Promise<boolean> {
		return await bcrypt.compare(attempt, password);
	}
}
