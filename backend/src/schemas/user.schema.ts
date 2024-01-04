import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ unique: true, required: true, minlength: 3, maxlength: 40 })
    username: string;

    @Prop({ unique: true, required: true, minlength: 3, maxlength: 254 })
    email: string;

    @Prop({ required: true })
    password: string;
    
    @Prop({ default: 'user', required: true })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User)