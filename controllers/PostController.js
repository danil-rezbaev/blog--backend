import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const {title, text, imageUrl, tags} = req.body

    const doc = new PostModel({
      title,
      text,
      imageUrl,
      tags: tags?.split(','),
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
    const findFile = await PostModel
      .find()
      .sort({createdAt: -1})
      .populate({ path: "user", select: ["username", "avatar"] })
      .exec()

    if(findFile) {
      return res.status(200).json(findFile)
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

export const getPopular = async (req, res) => {
  try {
    const findFile = await PostModel
      .find()
      .sort({viewsCount: -1})
      .populate({ path: "user", select: ["username", "avatar"] })
      .exec()

    if(findFile) {
      return res.status(200).json(findFile)
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
    }).populate({ path: "user", select: ["username", "avatar"] })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось найти пост"
    })
  }
}

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec()

    if(!posts) {
      return res.status(500).json({
        message: "Посты не найдены"
      })
    }

    const tags = posts.map(post => post.tags).flat().slice(0, 5)

    return res.status(200).json(tags)
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось найти посты"
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id

    PostModel.findByIdAndDelete({
      _id: postId
    }, (err, doc) => {
      if(err) {
        return res.json({
          message: "Не удалось удалить пост"
        })
      }

      if(!doc) {
        return res.json({
          message: "Статья не найдена"
        })
      }

      res.json({
        success: true
      })
    })
  } catch (err) {
    console.log(err);
    res.json({
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
      title, text, body, imageUrl, userId, tags: tags?.split(',')
    })

    res.status(200).json({
      success: true
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить пост"
    })
  }
}

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id
    const {user, text} = req.body

    await PostModel.updateOne({
      _id: postId
    }, {
      $push: {comments: {user, text}}
    })

    res.status(200).json({
      success: true
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить пост"
    })
  }
}

export const removeComment = async (req, res) => {
  try {
    const postId = req.params.id
    const {user, text} = req.body

    await PostModel.updateOne({
      _id: postId
    }, {
      $push: {comments: {user, text}}
    })

    res.status(200).json({
      success: true
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить пост"
    })
  }
}
