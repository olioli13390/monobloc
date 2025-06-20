const express = require("express")
const router = express.Router()
const companyController = require("../controllers/companyController")
const authguard = require('../services/authguard')

router.get('/register', companyController.getRegister)
router.post('/register', companyController.postRegister)

router.get('/login', companyController.getLogin)
router.post('/login', companyController.postLogin)

router.get('/logout', companyController.getLogout)

router.get('/update/company/:id', companyController.getUpdateCompany)
router.post('/update/company/:id', companyController.postUpdateCompany)

module.exports = router