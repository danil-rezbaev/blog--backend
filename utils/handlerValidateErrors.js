import { validationResult } from "express-validator";

const handlerValidateErrors = (res,req,next) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }

  next()
}

export default handlerValidateErrors
