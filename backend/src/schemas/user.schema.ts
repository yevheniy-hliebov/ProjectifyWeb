import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ unique: true, required: true, minlength: 3, maxlength: 40 })
    username: string;

    @Prop({ unique: true, required: true, minlength: 3, maxlength: 254 })
    email: string;

    @Prop({ required: true })
    password: string;
    
    @Prop({ default: 'user', required: true })
    role: string;
    
    @Prop({ default: Date.now })
    created_at: Date;
    
    @Prop({ default: Date.now })
    updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User)