const { PrismaClient } = require('../../generated/prisma')
const bcrypt = require("bcrypt")
const hashPasswordExtensions = require("../services/extensions/hashPassword")
const prisma = new PrismaClient({}).$extends(hashPasswordExtensions)
const session = require("express-session")


exports.getRegister = async (req, res) => { /// Affiche le register
    const companies = await prisma.company.findMany()
    res.render('pages/register.twig')
}

exports.postRegister = async (req, res) => { /// Créer une entreprise
    try {
        if (!req.body.status.match(/^.+$/)) {
            throw { status: "Statut invalide" }
        }
        if (!req.body.siret.match(/^\d{14}$/)) {
            throw { siret: "SIRET invalide" }
        }
        if (!req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            throw { password: "Mot de passe invalide" }
        }
        if (req.body.name) {
            if (!req.body.name.match(/^[a-zA-Z0-9\s\-']+$/)) {
                throw { name: "Nom invalide" }
            }
        }
        if (req.body.password == req.body.confirmPassword) {
            const company = await prisma.company.create({
                data: {
                    status: req.body.status,
                    siret: req.body.siret,
                    password: req.body.password,
                    name: req.body.name,
                }
            })
            res.redirect("/login")
        } else throw ({ confirmPassword: "Vérification de mot de passe incorrecte" })
    } catch (error) {
        console.log(error)
    }
}

exports.getLogin = async (req, res) => { /// affiche login
    res.render("pages/login.twig")
}


exports.postLogin = async (req, res) => { /// authentification d'une entreprise
    try {
        const company = await prisma.company.findUnique({
            where: {
                siret: req.body.siret
            }
        })
        if (company) {
            if (await bcrypt.compare(req.body.password, company.password)) {
                req.session.company = company
                return res.redirect("/")
            } else {
                return res.render("pages/login.twig", {
                    error: {
                        password: "Mot de passe incorrect"
                    }
                })
            }
        } else {
            return res.render("pages/login.twig", {
                error: {
                    siret: "Siret inexistant"
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.getLogout = async (req, res) => { /// déco
    req.session.destroy()
    res.redirect("/login")
}
