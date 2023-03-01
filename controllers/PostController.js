import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const {title, text, imageUrl, tags} = req.body

    const doc = new PostModel({
      title,
      text,
      imageUrl,
      tags,
      user: req.userId
    })

    const post = await doc.save();

    res.json(post)
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось опубликовать пост"
    })
  }
}

export const getAll = async (req, res) => {
  try {
    const findFile = await PostModel.find().populate('user').exec()

    if(findFile) {
      return res.status(300).json(findFile)
    }

    return res.status(500).json({
      message: "Посты не найдены"
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось найти посты"
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id

    PostModel.findOneAndUpdate({_id: postId}, {
      $inc: {viewsCount: 1}
    }, {
      returnDocument: "after"
    }, (err, doc) => {
      if(err) {
        console.log(err);
        return res.status(500).json({
          message: "Не удалось вернуть пост"
        })
      }

      if(!doc) {
        return res.status(404).json({
          message: "Статья не найдена"
        })
      }

      res.json(doc)
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось найти пост"
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id

    await PostModel.findByIdAndDelete({
      _id: postId
    }, (err, doc) => {
      if(err) {
        console.log(err);
        return res.status(500).json({
          message: "Не удалось удалить пост"
        })
      }

      if(!doc) {
        return res.status(404).json({
          message: "Статья не найдена"
        })
      }

      res.status(300).json({
        success: true
      })
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось найти пост"
    })
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id
    const {title, text, body, imageUrl, userId, tags} = req.body

    await PostModel.updateOne({
      _id: postId
    }, {
      title, text, body, imageUrl, userId, tags
    })

    res.status(300).json({
      success: true
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить пост"
    })
  }
}
