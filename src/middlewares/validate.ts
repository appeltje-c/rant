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
import Joi from 'joi'
import httpStatus from 'http-status'
import ApiError from '../errors/ApiError'
import { NextFunction, Request, Response } from 'express'

const pick = (object: any, keys: string[]): object => {
  return keys.reduce((obj: any, key: string) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
}

const validate = (schema: any) => (request: Request, response: Response, next: NextFunction) => {

  const validSchema = pick(schema, ['params', 'query', 'body'])

  const object = pick(request, Object.keys(validSchema))

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object)

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ')
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage))
  }

  Object.assign(request, value)

  return next()
}

export default validate
