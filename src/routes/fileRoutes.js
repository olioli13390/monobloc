const express = require("express")
const router = express.Router()
const fileController = require("../controllers/fileController")
const authguard = require('../services/authguard')

router.post('/addcsv', authguard, fileController.uploadSingle)
router.post('/addcsv', authguard, fileController.postUploadFile)

router.post('/delete/file/:id', authguard, fileController.deleteFile)
module.exports = router