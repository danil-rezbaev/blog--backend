import fs from 'fs'
import sharp from 'sharp'

export default async (req, res, next) => {
  try {
    const { path, destination, filename, mimetype } = req.file

    const newName = `${destination}/${filename}_clone.${mimetype.split('/')[1]}`

    const data = await sharp(path)
      .jpeg({
        quality: 100,
        chromaSubsampling: '4:4:4'
      })
      .resize({ width: 350, height: 350})
      .toFile(newName)

    fs.unlinkSync(path);
    next();
  } catch (e) {
    return res.status(403).json({
      message: "Нет доступа"
    })
  }
}
