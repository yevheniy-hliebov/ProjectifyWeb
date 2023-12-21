import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { UserDto } from 'src/interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { validate, validatePassword } from 'src/validation/user.validation';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

  async create(userDto: UserDto): Promise<UserDocument | undefined> {
    const { username, email, password } = userDto;

    // Check username/email uniqueness
    const isUniqueFields = await Promise.all([
      this.isUnique('username', username),
      this.isUnique('email', email),
    ]);
    
    if (!isUniqueFields.some((error) => error)) {
      const errors: Record<string, string> = {}
      if (!isUniqueFields[0]) errors.username = 'Username must be unique'
      if (!isUniqueFields[1]) errors.email = 'Email must be unique'
      throw new HttpException({ message: 'Failed to create user', errors }, HttpStatus.BAD_REQUEST);
    }

    // Check validation
    const validationErrors = validate(userDto);
    if (Object.keys(validationErrors).length > 0) {
      throw new HttpException({ message: "Failed to create user", validationErrors }, HttpStatus.BAD_REQUEST)
    } else {
      // Hash password
      userDto.password = await this.hashPassword(password);

      // Create user
      const createdUser = await this.userModel.create(userDto);
      if (!createdUser) throw new HttpException('User not created', 400)
      return createdUser;
    }
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find().select({ __v: 0 }).exec();
  }

  async findById(id: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findById(id).select({ __v: 0 }).exec();
    return user;
  }

  async findOne(username: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findOne({ username }).select({ __v: 0 }).exec();
    if (!user) throw new HttpException('User not found', 404)
    return user;
  }

  async update(id: string, userDto: UserDto): Promise<UserDocument | undefined> {
    const { username, email, password } = userDto;
    const oldUserDto = await this.findById(id);
    if (!oldUserDto) throw new HttpException('User not found', 404)

    // Check changes
    for (const key in userDto) {
      if (oldUserDto[key] !== userDto[key]) {
        throw new HttpException('The data has not changed. No update required.', 400)
      }
    }

    // Check username/email uniqueness
    const isUniqueFields = await Promise.all([
      username !== oldUserDto.username && this.isUnique('username', username),
      email !== oldUserDto.email && this.isUnique('email', email),
    ]);
    if (!isUniqueFields.some((error) => error)) {
      const errors: Record<string, string> = {}
      if (!isUniqueFields[0]) errors.username = 'Username must be unique'
      if (!isUniqueFields[1]) errors.email = 'Email must be unique'
      throw new HttpException({ message: 'Failed to create user', errors }, HttpStatus.BAD_REQUEST);
    }

    // Check validation
    const validationErrors = validate(userDto);
    if (Object.keys(validationErrors).length > 0) {
      throw new HttpException({ message: "Failed to update user", validationErrors }, HttpStatus.BAD_REQUEST)
    } else {
      // Hash password
      if (password !== oldUserDto.password) {
        oldUserDto.password = await this.hashPassword(password);
      }

      oldUserDto.username = username;
      oldUserDto.email = email;
      oldUserDto.updated_at = new Date();

      // Update user
      const updatedUser = await this.userModel.findByIdAndUpdate(id, oldUserDto, { new: true }).select({ __v: 0 }).exec();
      if (!updatedUser) throw new HttpException('User not updated', 400)
      return updatedUser;
    }
  }

  async isCorrectPassword(id: string, password: string): Promise<boolean> {
    const userPassword = await this.userModel.findById(id).select('password').exec();
    const passwordString = userPassword.password;
    const isMatchPassword = await bcrypt.compare(passwordString, password);
    return isMatchPassword;
  }

  async changePassword(id: string, password: string): Promise<UserDocument> {
    const passwordError = validatePassword(password);
    if (passwordError.length > 0) {
      throw new HttpException({message: passwordError}, HttpStatus.BAD_REQUEST)
    } else {
      const hashedPassword = await this.hashPassword(password);
      const user = await this.userModel.findByIdAndUpdate(id, {password: hashedPassword}).exec();
      return user;
    }
  }


  async delete(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).select({ __v: 0 }).exec();
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
}