const { PrismaClient } = require("../../generated/prisma")
const prisma = new PrismaClient()
const authguard = async (req, res, next) => {
    try {
        if (req.session.company) {
            return next()
        }
        throw new Error("Company non connecté");
    } catch (error) {
        res.redirect('/login')
    }
}

module.exports = authguard