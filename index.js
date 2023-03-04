import express from 'express'
import multer from 'multer'
import mongoose from "mongoose";
import {registerValidation, loginValidation} from './validations/auth.js'
import { checkAuth, handlerValidateErrors } from "./utils/index.js"
import { UserController, PostController, TagsController } from "./controllers/index.js"
import { postCreateValidation } from "./validations/post.js";
import cors from 'cors'
import fs from 'fs'
import compressImage from "./utils/compressImage.js";

const dbName = 'blog'

mongoose.connect(
  `mongodb+srv://daniel:w1w2w3@cluster0.ehjllvh.mongodb.net/${dbName}`
).then(() => console.log('db ok'))
  .catch(() => console.error('db error'))

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if(!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads')
    }
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/register', registerValidation, handlerValidateErrors, UserController.register)
app.post('/auth/login', loginValidation, handlerValidateErrors, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/posts', PostController.getAll)
app.get('/posts/popular', PostController.getPopular)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update)

app.patch('/posts/:id/comment', checkAuth, PostController.addComment)
// app.delete('/posts/:id/comment', checkAuth, PostController.removeComment)

app.get('/tags/:tagsName', TagsController.getPostsOnTag)

app.post('/upload', checkAuth, upload.single('image'), compressImage, (req, res) => {
  const image = req.file.optimizedImage || req.file.originalname
  res.json({
    url: image
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
