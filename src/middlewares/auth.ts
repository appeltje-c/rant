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
import passport from 'passport'
import httpStatus from 'http-status'
import ApiError from '../errors/ApiError'
import { roleRights } from '../config/roles'
import { NextFunction, Request, Response } from 'express'
import { User } from '../models/user.model'

const verifyCallback = (
  req: Request,
  resolve: Function,
  reject: Function,
  requiredRights: string[]) => async (err: Error, user: User, info: string) => {

    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'))
    }

    req.user = user

    if (requiredRights.length) {

      const userRights = roleRights.get(user.role)
      const hasRequiredRights = requiredRights.every((requiredRight) => userRights?.includes(requiredRight))

      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'))
      }
    }

    resolve()
  }

const auth = (...requiredRights: string[]) => async (req: Request, res: Response, next: NextFunction) => {

  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next)
  }).then(() => next())
    .catch((err) => next(err))
}

export default auth
