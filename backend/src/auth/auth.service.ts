import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/interfaces/user.interface';
import { UsersService } from 'src/services/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(userDto: UserDto): Promise<any> {
    const createdUser = await this.usersService.create(userDto);

    if (createdUser) {
      const payload = { sub: createdUser.id, username: createdUser.username }

      return {
        user: createdUser,
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new HttpException('Failed to register', HttpStatus.BAD_REQUEST)
    }
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    const isMatchPassword = await bcrypt.compare(password, user.password) 

    if (!isMatchPassword) {
      throw new HttpException('Password is incorrect', 400);
    }

    const payload = { sub: user.id, username: user.username }

    return {
      user: user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}