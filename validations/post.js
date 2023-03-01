import {body} from 'express-validator'

const postCreateValidation = [
  body('title', "Введите заголовок статьи").isLength({min: 3}).isString(),
  body('text', "Введите текст статьии").isLength({min: 10}).isString(),
  body('tags', "Неверный формат тегов укажите массив").optional().isString(),
  body('imageUrl', "Неверная ссылка на изображение").optional().isString(),
]

export {postCreateValidation}
