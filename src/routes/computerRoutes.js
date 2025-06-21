const express = require("express")
const router = express.Router()
const computerController = require("../controllers/computerController")
const authguard = require('../services/authguard')

router.post("/addcomputer", authguard, computerController.postComputer)

router.post("/delete/computer/:id", authguard, computerController.deleteComputer)

router.get("/update/computer/:id", authguard, computerController.getUpdateComputer)

router.post("/update/computer/:id", authguard, computerController.postUpdateComputer)

router.post("/dissociate/computer/:id", authguard, computerController.dissociateComputer);

module.exports = router