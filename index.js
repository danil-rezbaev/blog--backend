import express from 'express'
import multer from 'multer'
import mongoose from "mongoose";
import {registerValidation, loginValidation} from './validations/auth.js'
import { checkAuth, handlerValidateErrors } from "./utils/index.js"
import { UserController, PostController } from "./controllers/index.js"
import { postCreateValidation } from "./validations/post.js";
import * as fs from "fs";


const dbName = 'blog'

mongoose.connect(
  `mongodb+srv://daniel:w1w2w3@cluster0.ehjllvh.mongodb.net/${dbName}`
).then(() => console.log('db ok'))
  .catch(() => console.error('db error'))

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({storage})

app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.post('/auth/register', registerValidation, handlerValidateErrors, UserController.register)
app.post('/auth/login', loginValidation, handlerValidateErrors, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `uploads/${req.file.originalname}`
  })
})

// app.get('/uploads/:file', (req, res) => {
//   const reqFileName = req.params.file
//   const fileContent = fs.readFileSync(`uploads/${reqFileName}`);
//
//   res.send(fileContent)
// })

app.listen(4444, (err) => {
  if(err) {
    console.log('error')
  }
  console.log('started')
})
