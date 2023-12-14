import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { UserData } from 'src/interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

  async create(userData: UserData): Promise<User | undefined> {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    userData.password = hashedPassword;
    const createdUser = await this.userModel.create(userData);
    if (!createdUser) throw new HttpException('User not created', 400)
    return this.findById(createdUser._id);
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.userModel.findById(id).select({ __v: 0 }).exec();
    if (!user) throw new HttpException('User not found', 404)
    return user;
  }

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ username }).select({ __v: 0 }).exec();
    if (!user) throw new HttpException('User not found', 404)
    return user;
  }
}