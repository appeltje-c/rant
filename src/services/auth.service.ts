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
import httpStatus from 'http-status'
import ApiError from '../errors/ApiError'
import { tokenTypes } from '../config/tokens'
import { updateUserById, getUserById, getUserByEmail } from './user.service'
import { generateAuthTokens, verifyToken } from './token.service'
import { User } from '../models/user.model'
import { TokenCollection } from '../models/token.model'

const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<User> => {

  const user = await getUserByEmail(email)

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password')
  }

  return user
}

const logout = async (refreshToken: string) => {

  const refreshTokenDoc = await TokenCollection.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false })

  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found')
  }

  return await TokenCollection.findByIdAndDelete(refreshTokenDoc.id)
}

const refreshAuth = async (refreshToken: string): Promise<object> => {
  try {

    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH)
    const user = await getUserById(refreshTokenDoc.user)

    if (!user) {
      throw new Error()
    }

    await TokenCollection.findByIdAndDelete(refreshTokenDoc.id)
    return generateAuthTokens(user)

  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate')
  }
}

const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<any> => {
  try {
    const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD)
    const user = await getUserById(resetPasswordTokenDoc.user)
    if (!user) {
      throw new Error()
    }
    await updateUserById(user.id, { password: newPassword })
    await TokenCollection.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD })
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed')
  }
}

const verifyEmail = async (verifyEmailToken: string): Promise<any> => {
  try {
    const verifyEmailTokenDoc = await verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL)
    const user = await getUserById(verifyEmailTokenDoc.user)
    if (!user) {
      throw new Error()
    }
    await TokenCollection.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL })
    await updateUserById(user.id, { isEmailVerified: true })
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed')
  }
};

export {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail
}
