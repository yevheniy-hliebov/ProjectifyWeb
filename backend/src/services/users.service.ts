import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { UserData } from 'src/interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

  async create(userData: UserData): Promise<UserDocument | undefined> {
    await this.validateUserData(userData);

    userData.password = await this.hashPassword(userData.password);

    const createdUser = await this.userModel.create(userData);
    if (!createdUser) throw new HttpException('User not created', 400)
    return this.findById(createdUser.id);
  }

  async findById(id: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findById(id).select({ __v: 0 }).exec();
    if (!user) throw new HttpException('User not found', 404)
    return user;
  }

  async findOne(username: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findOne({ username }).select({ __v: 0 }).exec();
    if (!user) throw new HttpException('User not found', 404)
    return user;
  }

  async isUnique(field: string, value: any): Promise<boolean> {
    const user = await this.userModel.findOne({ [field]: value }).exec();
    return !user;
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10)
  }

  private async validateUserData(userData: UserData) {
    const { username, email, password } = userData;

    type ErrorsUserData = {
      username?: string,
      email?: string,
      password?: string,
    } 

    let errors: ErrorsUserData = {};
    
    const isValidUsername = validateUsername(username)
    if (!isValidUsername) {
      errors.username = 'Invalid username';
    }
    
    const isUniqueUserName = await this.isUnique('username', username);
    if (!isUniqueUserName) {
      errors.username = 'The user with this username is registered';
    }
    
    const isValidEmail = validateEmail(email)
    if (!isValidEmail) {
      errors.email = 'Invalid email';
    }
    
    const isUniqueEmail = await this.isUnique('email', email);
    if (!isUniqueEmail) {
      errors.email = 'The user with this email is registered';
    }
    
    const isValidPassword = validatePassword(password)
    if (!isValidPassword) {
      errors.password = 'Invalid password';
    }

    if (Object.keys(errors).length > 0) {
      throw new HttpException({ errors }, 400)
    }
  }
}

export function validateUsername(username: string) {
  if (!/^[a-zA-Z0-9]+([-]?[a-zA-Z0-9]+)*$/.test(username)) return false;
  if (username.length < 3 || username.length > 40) return false;

  return true;
}

export function validateEmail(email: string) {
  if (!/^[a-zA-Z0-9]+([-_.]?[a-zA-Z0-9]+)*[@]{1}[a-zA-Z0-9]+([-_]{1}[a-zA-Z0-9]+)*([.]{1}[a-zA-Z0-9]{2,})+$/.test(email)) return false;
  return true;
}

export function validatePassword(password: string) {
  if (password.length < 8 || password.length > 30) {
    return false;
  }
  const hasUppercase = /(?=.*[A-Z])/.test(password);
  const hasLowercase = /(?=.*[a-z])/.test(password);
  const hasDigit = /(?=.*\d)/.test(password);
  const hasSpecialCharacter = /(?=.*[!@#$%^&*(){}\]\[<>\|~])/.test(password);
  if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialCharacter) {
    return false;
  }

  return true;
}