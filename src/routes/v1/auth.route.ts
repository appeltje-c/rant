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
import { Router } from 'express'
import validate from '../../middlewares/validate'
import * as rules from '../../validations/auth.validation'
import auth from '../../middlewares/auth'
import {
    forgotPassword,
    login,
    logout,
    refreshTokens,
    register,
    resetPassword,
    sendVerificationEmail,
    verifyEmail
} from '../../controllers/auth.controller'

const router = Router()

router.post('/register', validate(rules.register), register)
router.post('/login', validate(rules.login), login)
router.post('/logout', validate(rules.logout), logout)
router.post('/refresh-tokens', validate(rules.refreshTokens), refreshTokens)
router.post('/forgot-password', validate(rules.forgotPassword), forgotPassword)
router.post('/reset-password', validate(rules.resetPassword), resetPassword)
router.post('/send-verification-email', auth(), sendVerificationEmail)
router.post('/verify-email', validate(rules.verifyEmail), verifyEmail)

export default router