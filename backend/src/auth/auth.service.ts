import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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
  private readonly logger = new Logger('Auth')

  async register(userDto: UserDto): Promise<any> {
    const createdUser = await this.usersService.create(userDto);

    if (createdUser) {
      const payload = { sub: createdUser.id, username: createdUser.username }

      this.logger.log(`User with id '${createdUser.id}' successfully registered`)
      
      return {
        user: createdUser,
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      this.logger.error(`Failed to register: User '${userDto.username}' not registered`)
      throw new HttpException('Failed to register', HttpStatus.BAD_REQUEST)
    }
  }
  
  async login(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    
    const isMatchPassword = await bcrypt.compare(password, user.password) 
    
    if (!isMatchPassword) {
      this.logger.error(`Failed to authorized user '${user.id}': Password is incorrect`)
      throw new HttpException('Password is incorrect', 400);
    }
    
    const payload = { sub: user.id, username: user.username }
    
    this.logger.log(`User with id '${user.id}' successfully authorized`)
    return {
      user: user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}