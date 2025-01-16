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
import { NextFunction, Request, Response } from "express"

const catchAsync = (fn: Function) => (request: Request, response: Response, next: NextFunction) => {
  Promise.resolve(fn(request, response, next)).catch((err) => next(err))
};

export default catchAsync
