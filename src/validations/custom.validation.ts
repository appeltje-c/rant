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
import { CustomHelpers } from "joi"

const objectId = (value: string, helpers: CustomHelpers) => {

  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message({ messages: '"{{#label}}" must be a valid mongo id' })
  }

  return value
}

const password = (value: string, helpers: CustomHelpers) => {

  if (value.length < 8) {
    return helpers.message({ messages: 'password must be at least 8 characters' })
  }

  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message({ messages: 'password must contain at least 1 letter and 1 number' })
  }

  return value
}

export {
  objectId,
  password
}
