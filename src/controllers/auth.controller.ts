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
import catchAsync from '../errors/catchAsync'
import { authService, userService, tokenService, emailService } from '../services'
import { Request, Response } from 'express'
import ApiError from '../errors/ApiError'
import { AuthenticatedRequest } from '../types'

const register = catchAsync(async (request: Request, response: Response) => {
  const user = await userService.createUser(request.body)
  const tokens = await tokenService.generateAuthTokens(user)
  response.status(httpStatus.CREATED).send({ user, tokens })
})

const login = catchAsync(async (request: Request, response: Response) => {
  const { email, password } = request.body
  const user = await authService.loginUserWithEmailAndPassword(email, password)
  const tokens = await tokenService.generateAuthTokens(user)
  response.send({ user, tokens })
})

const logout = catchAsync(async (request: Request, response: Response) => {
  await authService.logout(request.body.refreshToken)
  response.status(httpStatus.NO_CONTENT).send()
})

const refreshTokens = catchAsync(async (request: Request, response: Response) => {
  const tokens = await authService.refreshAuth(request.body.refreshToken)
  response.send({ ...tokens })
})

const forgotPassword = catchAsync(async (request: Request, response: Response) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(request.body.email)
  await emailService.sendResetPasswordEmail(request.body.email, resetPasswordToken)
  response.status(httpStatus.NO_CONTENT).send()
})

const resetPassword = catchAsync(async (request: Request, response: Response) => {
  const token = request.query.token

  if (typeof token !== 'string') {
    throw new ApiError(1001, 'invalid token type')
  }

  await authService.resetPassword(token, request.body.password)
  response.status(httpStatus.NO_CONTENT).send()
})

const sendVerificationEmail = catchAsync(async (request: AuthenticatedRequest, response: Response) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(request.user)
  await emailService.sendVerificationEmail(request.user.email, verifyEmailToken)
  response.status(httpStatus.NO_CONTENT).send()
})

const verifyEmail = catchAsync(async (request: Request, response: Response) => {
  const token = request.query.token

  if (typeof token !== 'string') {
    throw new ApiError(1001, 'invalid token type')
  }

  await authService.verifyEmail(token)
  response.status(httpStatus.NO_CONTENT).send()
})

export {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
}
