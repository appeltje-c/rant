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
import express from 'express'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import compression from 'compression'
import cors from 'cors'
import passport from 'passport'
import httpStatus from 'http-status'
import config from './config/config'
import * as morgan from './config/morgan'
import { jwtStrategy } from './config/passport'
import { authLimiter } from './middlewares/rateLimiter'
import routes from './routes/v1'
import { errorConverter, errorHandler } from './middlewares/error'
import ApiError from './errors/ApiError'

const app = express()

if (config.env !== 'test') {
  app.use(morgan.successHandler)
  app.use(morgan.errorHandler)
}

// set security HTTP headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// sanitize request data
// @todo : find replacement for xss-clean
//app.use(xssClean())

app.use(mongoSanitize())

// gzip compression
app.use(compression())

// enable cors
app.use(cors())
app.options('*', cors())

// jwt authentication
app.use(passport.initialize())
passport.use('jwt', jwtStrategy)

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter)
}

// v1 api routes
app.use('/v1', routes)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
});

// convert error to ApiError, if needed
app.use(errorConverter)

// handle error
app.use(errorHandler)

export default app
