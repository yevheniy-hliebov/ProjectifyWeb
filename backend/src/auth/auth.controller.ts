import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.guard';
import { UserDto } from 'src/interfaces/user.interface';
import { Response as Res } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() userDto: UserDto, @Response() res: Res) {
    const token = await this.authService.register(userDto);    
    res.header('Authorization-Cookie', `access-token=Bearer ${token.access_token}; max-age=3600; secure=true; path=/`);
    return res.json('Authorized')
  }

  @Public()
  @Post('login')
  async login(@Body() signInDto: Record<string, any>, @Response() res: Res) {
    const token = await this.authService.login(signInDto.username, signInDto.password);
    res.header('Authorization-Cookie', `access-token=Bearer ${token.access_token}; max-age=3600; secure=true; path=/`);
    return res.json('Authorized')
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}