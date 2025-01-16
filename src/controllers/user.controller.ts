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
import { userService } from '../services'
import { Request, Response } from 'express'
import { Types } from 'mongoose'
import ApiError from '../errors/ApiError'

const create = catchAsync(async (request: Request, response: Response) => {
  const user = await userService.createUser(request.body)
  response.status(httpStatus.CREATED).send(user)
})

const get = catchAsync(async (request: Request, response: Response) => {
  const id = new Types.ObjectId(request.params.userId)
  const user = await userService.getUserById(id)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  response.send(user)
})

const update = catchAsync(async (request: Request, response: Response) => {
  const id = new Types.ObjectId(request.params.userId)
  const user = await userService.updateUserById(id, request.body)
  response.send(user)
})

const del = catchAsync(async (request: Request, response: Response) => {
  const id = new Types.ObjectId(request.params.userId)
  await userService.deleteUserById(id)
  response.status(httpStatus.NO_CONTENT).send()
})

export {
  create,
  get,
  update,
  del
}
