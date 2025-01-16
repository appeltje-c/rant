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
import config from '../config/config'
import { ObjectId } from 'mongoose'
import moment, { Moment } from 'moment'
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import ApiError from '../errors/ApiError'
import { tokenTypes } from '../config/tokens'
import { getUserByEmail } from "./user.service"
import { User } from '../models/user.model'
import { Token, TokenCollection } from '../models/token.model'

const generateToken = (userId: ObjectId, expires: Moment, type: string, secret: string = config.jwt.secret): string => {

  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type
  }

  return jwt.sign(payload, secret)
}

const saveToken = async (token: string, userId: ObjectId, expires: Moment, type: string, blacklisted: boolean = false): Promise<Token> => {

  return await TokenCollection.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted
  })

}

const verifyToken = async (token: string, type: string): Promise<Token> => {

  const payload = jwt.verify(token, config.jwt.secret)
  const tokenDoc = await TokenCollection.findOne({ token, type, user: payload.sub, blacklisted: false })

  if (!tokenDoc) {
    throw new Error('Token not found')
  }

  return tokenDoc
};

const generateAuthTokens = async (user: any): Promise<object> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const generateResetPasswordToken = async (email: string): Promise<string> => {

  const user = await getUserByEmail(email)

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email')
  }

  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes')
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD)
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD)

  return resetPasswordToken
}

const generateVerifyEmailToken = async (user: User): Promise<string> => {

  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes')
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL)
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL)

  return verifyEmailToken
}

export {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken
}
