/** 
 * MIT License
 * 
 * Copyright (c) 2025 Martijn Benjamin <hello@martijn-benjamin.com>
 * 
 * This source code is part of the Rest Api on Node with Typescript 
 * "Rant" boilerplate and is free to modify and use as-is.
 * 
 * See LICENSE in the root of this distribution.
 * 
 * This copyright header must be included in all copies or 
 * any portions of the Software.
 */
import { Schema, model, ObjectId, Model, HydratedDocument, Document } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

interface User extends Document, UserMethods {
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  isEmailVerified: boolean
}

interface UserMethods {
  isPasswordMatch(password: string): boolean
}

interface UserModel extends Model<User, {}, UserMethods> {
  isEmailTaken(email: string): Promise<HydratedDocument<User, UserMethods>>;
}

const schema = new Schema<User, UserModel, UserMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true
  }
)

schema.static('isEmailTaken', async function (email: string, excludeUserId?: ObjectId) {
  const user: User | null = await this.findOne({ email, _id: { $ne: excludeUserId } })
  return !!user
})

schema.method('isPasswordMatch', async function (password: string): Promise<boolean> {
  const user = this
  return bcrypt.compare(password, user.password)
})

schema.pre('save', async function (next) {

  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const UserCollection = model<User, UserModel>('UserCollection', schema)

export {
  User,
  UserCollection
}