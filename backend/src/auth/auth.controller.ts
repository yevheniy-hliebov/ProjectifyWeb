import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, Response, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.guard';
import { UserDto } from 'src/interfaces/user.interface';
import { Response as Res } from 'express';
import { UsersService } from 'src/services/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) { }

  @Public()
  @Post('register')
  async register(@Body() userDto: UserDto, @Response() res: Res) {
    const token = await this.authService.register(userDto);    
    res.header('Authorization-Cookie', `access-token=Bearer ${token.access_token}; max-age=3600; secure=true; path=/`);
    return res.json('Authorized')
  }
  
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() signInDto: Record<string, any>, @Response() res: Res) {
    const token = await this.authService.login(signInDto.username, signInDto.password);
    res.header('Authorization-Cookie', `access-token=Bearer ${token.access_token}; max-age=3600; secure=true; path=/`);
    return res.json('Authorized')
  }

  @Get('profile')
  async getProfile(@Request() req) {
    const reqUser = req.user;
    const user = await this.userService.findById(reqUser.sub);
    if (!user) throw new UnauthorizedException();
    return { id: user.id, username: user.username };
  }
}