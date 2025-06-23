const { PrismaClient } = require('../../generated/prisma')
const bcrypt = require("bcrypt")
const hashPasswordExtensions = require("../services/extensions/hashPassword")
const prisma = new PrismaClient({}).$extends(hashPasswordExtensions)
const session = require("express-session")
const { error } = require('console')


exports.getRegister = async (req, res) => { /// Affiche le register
    const companies = await prisma.company.findMany()
    res.render('pages/register.twig')
}

exports.postRegister = async (req, res) => { /// Créer une entreprise
    try {
        if (!req.body.status.match(/^.+$/)) {

            return res.render('pages/register.twig', {
                error: {
                    status: "Raison sociale incorrecte"
                }
            })
        }
        if (!req.body.siret.match(/^\d{14}$/)) {
            return res.render('pages/register.twig', {
                error: {
                    siret: "Siret incorrect, doit contenir 14 caractères"
                }
            })
        }
        if (!req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            return res.render('pages/register.twig', {
                error: {
                    password: "Mot de passe incorrect"
                }
            })
        }
        if (req.body.name) {
            if (!req.body.name.match(/^[a-zA-Z0-9\s\-']+$/)) {
                return res.render('pages/register.twig', {
                    error: {
                        name: "Nom incorrect"
                    }
                })
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
        } else {
            return res.render('pages/register.twig')

        }
    } catch (error) {
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


exports.getUpdateCompany = async (req, res) => { /// attrape la modification de la company
    try {
        const company = await prisma.company.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.render('pages/register.twig', { company, company: req.session.company })
    } catch (error) {
        console.log(error);
    }
}


exports.postUpdateCompany = async (req, res) => { /// poste la modification

    const { status, siret, password, name } = req.body

    try {

        if (!req.body.status.match(/^.+$/)) {
            return res.render('pages/register.twig', {
                error: {
                    status: "Raison sociale incorrecte"
                },
                company: { ...req.body }, editMod: false
            })
        }
        if (!req.body.siret.match(/^\d{14}$/)) {
            return res.render('pages/register.twig', {
                error: {
                    siret: "Siret invalide"
                }, company: { ...req.body }, editMod: false
            })
        }
        if (!req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            return res.render('pages/register.twig', {
                error: {
                    password: "Mauvais mot de passe"
                }, company: { ...req.body }, editMod: false
            })
        }
        if (req.body.name) {
            if (!req.body.name.match(/^[a-zA-Z0-9\s\-']+$/)) {
                return res.render('pages/register.twig', {
                    error: {
                        name: "Nom incorrect"
                    }, company: { ...req.body }, editMod: false
                })
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        if (req.body.password == req.body.confirmPassword) {
            const company = await prisma.company.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    status: req.body.status,
                    siret: req.body.siret,
                    password: hashedPassword,
                    name: req.body.name,
                }
            })
            res.redirect("/")
        } else {
            req.session.company = req.body
            return res.render('pages/register.twig', { company: req.session.company, error: { log: "Confirmez le mot de passe" } })
        }

    } catch (error) {
        console.log(error);
        const computer = await prisma.company.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })

    }
}


