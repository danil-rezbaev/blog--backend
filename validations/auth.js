import {body} from 'express-validator'

const registerValidation = [
  body('email', "Неверная почта").isEmail(),
  body('password').isLength({min: 5}),
  body('fullName').isLength({min: 3}),
  body('avatarUrl').optional().isURL(),
]

const loginValidation = [
  body('email', "Неверная почта").isEmail(),
  body('password', "Неверный пароль").isLength({min: 5}),
]

export {registerValidation, loginValidation}
