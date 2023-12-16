import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserData } from 'src/interfaces/user.interface';
import { UsersService } from 'src/services/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(userData: UserData): Promise<any> {
    const createdUser = await this.usersService.create(userData);

    const payload = { sub: createdUser.id, username: createdUser.username }

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) throw new HttpException('User not found', 404);

    const isMatchPassword = await bcrypt.compare(password, user.password) 

    if (!isMatchPassword) {
      throw new HttpException('Password not correct', 400);
    }

    const payload = { sub: user.id, username: user.username }

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}