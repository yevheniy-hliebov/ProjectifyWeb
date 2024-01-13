import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, Response, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Response as Res } from 'express';
import { AuthService } from './auth.service';
import { Public } from './auth.guard';
import { UsersService } from '../services/users.service';
import { UserDto } from '../types/user.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) { }

  @Public()
  @Post('register')
  async register(@Body() userDto: UserDto, @Response() res: Res) {
    const resultLogin = await this.authService.register(userDto);    
    res.header('Authorization-Cookie', `access-token=Bearer ${resultLogin.access_token}; max-age=3600; secure=true; path=/`);
    return res.json({ id: resultLogin.user.id, username: resultLogin.user.username, role: resultLogin.user.role })
  }
  
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() signInDto: Record<string, any>, @Response() res: Res) {
    const resultLogin = await this.authService.login(signInDto.username, signInDto.password);
    res.header('Authorization-Cookie', `access-token=Bearer ${resultLogin.access_token}; max-age=3600; secure=true; path=/`);
    return res.json({ id: resultLogin.user.id, username: resultLogin.user.username, role: resultLogin.user.role })
  }

  @Get()
  async getAuthorizedUser(@Request() req) {
    const reqUser = req.user;
    const user = await this.userService.findById(reqUser.id);
    if (!user) throw new UnauthorizedException();
    return { id: user.id, username: user.username, role: user.role };
  }

  @Get('profile')
  async getProfile(@Request() req) {
    const reqUser = req.user;
    const user = await this.userService.findById(reqUser.id);
    if (!user) throw new UnauthorizedException();
    return { id: user.id, username: user.username, role: user.role };
  }
}