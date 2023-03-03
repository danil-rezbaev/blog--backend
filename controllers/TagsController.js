import PostModel from "../models/Post.js";

export const getPostsOnTag = async (req, res) => {
  try {
    const tagName = req.params.tagsName

    const findFile = await PostModel
      .find({tags: {$all: [tagName]}})
      .sort({createdAt: -1})
      .populate({ path: "user", select: ["nickname", "avatar"] })
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
