const express = require("express")
const router = express.Router()
const workerController = require("../controllers/workerController")
const authguard = require('../services/authguard')

router.post("/addworker", authguard, workerController.postWorker)

router.post("/delete/:id", authguard, workerController.deleteWorker)

router.get("/update/:id", authguard, workerController.getUpdateWorker)
module.exports = router

router.post('/update/:id', authguard, workerController.updateWorker)