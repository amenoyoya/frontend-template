/**
 * /api/
 */
const express = require('express')
const router = express.Router()
const multer = require('multer')

/**
 * GET /api/
 * @response {message: 'Hello, Express!'}
 */
router.get('/', (req, res) => {
  res.json({
    message: 'Hello, Express!'
  }).send()
})

/**
 * POST /api/upload/
 * @request file
 * @response {result: boolean}
 */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${__dirname}/../public/`) // upload destination
  },
  filename(req, file, cb) {
    cb(null, file.originalname) // save as original upload file name
  }
})
router.post('/upload/', multer({ storage }).single('file'), (req, res) => {
  res.send({ location: `http://localhost:3333/${req.file.originalname}` })
})

// export
module.exports = router
