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
import mongoose from 'mongoose'
import config from './config/config'
import app from './app'
import logger from './config/logger'

/**
 * Start the http server after mongoose was able to connect to MongoDB
 */
mongoose.connect(config.mongoose.url, config.mongoose.options).then(mongoDB => {

  // mongoose connected, print some useful feedback
  logger.info(`===================== MongoDB ======================================`)
  logger.info(`Connected   : MongoDB Version ${mongoDB.version}`)
  logger.info(`Connections : ${mongoDB.connections.length}`)

  mongoDB.connections.forEach(connection => {
    logger.info(`User        : ${connection.user}`)
    logger.info(`Url         : mongodb://${connection.host}:${connection.port}/${connection.name}`)
  })

  logger.info(`Models      : ${mongoDB.modelNames()}`)

  const server = app.listen(config.port, () => {

    logger.info(`===================== Express ======================================`)
    logger.info(`Listening to port ${config.port}`)
  })

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed')
        process.exit(1)
      })
    } else {
      process.exit(1)
    }
  }

  const unexpectedErrorHandler = (error: any) => {
    logger.error(error)
    exitHandler()
  }

  process.on('uncaughtException', unexpectedErrorHandler)
  process.on('unhandledRejection', unexpectedErrorHandler)

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received')
    if (server) {
      server.close()
    }
  })

})
