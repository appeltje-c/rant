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
import auth from '../../middlewares/auth'
import validate from '../../middlewares/validate'
import * as rules from '../../validations/user.validation'
import { create, del, get, update } from '../../controllers/user.controller';

const router = express.Router();

router
  .route('/')
  .post(auth('user.create'), validate(rules.create), create)

router
  .route('/:userId')
  .get(auth('user.get'), validate(rules.get), get)
  .patch(auth('user.update'), validate(rules.update), update)
  .delete(auth('user.delete'), validate(rules.del), del)

export default router
