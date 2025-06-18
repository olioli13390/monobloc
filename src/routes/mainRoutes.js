const express = require("express")
const router = express.Router()
const mainController = require("../controllers/mainController")
const authguard = require('../services/authguard')

router.get('/', authguard, mainController.getHome)

router.get('/addworker', authguard, mainController.getAddWorker)

router.get('/addcomputer', authguard, mainController.getAddComputer)

router.get('/addcsv', authguard, mainController.getAddCsv)

module.exports = router