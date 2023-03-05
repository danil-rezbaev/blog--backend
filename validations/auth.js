import {body} from 'express-validator'

const registerValidation = [
  body('email', "Неверная почта").isEmail(),
  body('username', "Неверный логин").isString().isLength({min: 3}),
  body('password').isLength({min: 5}),
  body('avatarUrl').optional().isURL(),
]

const loginValidation = [
  body('username', "Неверный логин").isString().isLength({min: 3}),
  body('password', "Неверный пароль").isLength({min: 5}),
]

export {registerValidation, loginValidation}
