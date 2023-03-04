import fs from 'fs'
import sharp from 'sharp'

export default async (req, res, next) => {
  try {
    const { path, fieldname, destination, mimetype } = req.file
    const uniqueId = fieldname + '-' + Date.now()+'.'+mimetype.split('/')[1]
    const newPath = `${destination}/${uniqueId}`

    await sharp(path)
      .jpeg({ progressive: true, force: false })
      .png({ progressive: true, force: false })
      .resize({ width: 300, height: 300})
      .toFile(newPath)

    req.file.optimizedImage = newPath

    fs.unlinkSync(path)

    next();
  } catch (e) {
    return res.status(403).json({
      message: "Нет доступа " + e
    })
  }
}
