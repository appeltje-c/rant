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
import { Document, Model, Schema, SchemaTypes, Types, model } from 'mongoose'
import { tokenTypes } from '../config/tokens'

interface Token extends Document {
  token: string
  user: Types.ObjectId
  type: string
  expires: Date
  blacklisted: boolean
}

interface TokenModel extends Model<Token> { }

const tokenSchema = new Schema<Token, TokenModel>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const TokenCollection = model<Token, TokenModel>('TokenCollection', tokenSchema)

export {
  Token,
  TokenCollection
}
