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
import { Types } from 'mongoose'
import { User, UserCollection } from '../models/user.model'

const createUser = async (userBody: { email: string }): Promise<User> => {

  if (await UserCollection.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
  }

  return UserCollection.create(userBody)
}

const getUserById = async (id: Types.ObjectId): Promise<User | null> => {
  return UserCollection.findById(id)
}

const getUserByEmail = async (email: string): Promise<User | null> => {
  return UserCollection.findOne({ email })
}

const updateUserById = async (userId: Types.ObjectId, updateBody: any): Promise<User | null> => {

  const user = await getUserById(userId)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }

  if (updateBody.email && (await UserCollection.isEmailTaken(updateBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
  }

  Object.assign(user, updateBody)
  await user.save()


  return user
}

const deleteUserById = async (userId: Types.ObjectId): Promise<User> => {

  const user = await getUserById(userId)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }

  await user.deleteOne(user.id)
  return user
}

export {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById
}
