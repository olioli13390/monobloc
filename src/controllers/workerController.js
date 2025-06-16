const { PrismaClient } = require('../../generated/prisma')
const bcrypt = require("bcrypt")
const hashPasswordExtensions = require("../services/extensions/hashPassword")
const prisma = new PrismaClient({}).$extends(hashPasswordExtensions)
const session = require("express-session")



exports.postWorker = async (req, res) => { // créer worker
    try {
        if (!req.body.firstName.match(/^[A-ZÀ-ÿ][a-zà-ÿ]+$/)) {
            return res.render("pages/addworker.twig", {
                error: {
                    firstName: "Prénom invalide"
                }
            })
        }
        if (!req.body.lastName.match(/^[A-ZÀ-ÿ][a-zà-ÿ]+$/)) {
            return res.render("pages/addworker.twig", {
                error: {
                    lastName: "Nom invalide"
                }
            })
        }
        if (!req.body.mail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.render("pages/addworker.twig", {
                error: {
                    mail: "Email invalide"
                }
            })
        }
        if (!req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            return res.render("pages/addworker.twig", {
                error: {
                    password: "Mot de passe invalide"
                }
            })
        }
        if (!req.body.age.match(/^\d+$/)) {
            return res.render("pages/addworker.twig", {
                error: {
                    age: "Age invalide"
                }
            })
        }

        const worker = await prisma.worker.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mail: req.body.mail,
                password: req.body.password,
                age: parseInt(req.body.age, 10),
                gender: req.body.gender,
                company_id: req.session.company.id,

                ...(req.body.computer && req.body.computer !== "" && {

                    computer: {
                        connect: {
                            id: parseInt(req.body.computer)
                        }
                    }
                })
            }
        })
        res.redirect("/")
    } catch (error) {
        console.log(error)
    }
}

exports.deleteWorker = async (req, res) => { // delete worker
    try {
        const worker = await prisma.worker.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}

exports.getUpdateWorker = async (req, res) => { // affiche formulaire modif
    try {
        const worker = await prisma.worker.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })
        const company = await prisma.company.findUnique({
            where: {
                siret: req.session.company.siret
            },
            include: {
                computers: true
            }
        })
        res.render("pages/addworker.twig", { worker, company: req.session.company, computers: company.computers })
    } catch (error) {
        console.log();
    }
}

exports.updateWorker = async (req, res) => { // update worker
    try {
        const { firstName, lastName, mail, password, age, gender, computer } = req.body
        if (!req.body.firstName.match(/^[A-ZÀ-ÿ][a-zà-ÿ]+$/)) {
            return res.render("pages/addworker.twig", {
                error: {
                    firstName: "Prénom invalide"
                }, worker: { ...req.body, id: req.params.id }
            })
        }
        if (!req.body.lastName.match(/^[A-ZÀ-ÿ][a-zà-ÿ]+$/)) {
            return res.render("pages/addworker.twig", {
                error: {
                    lastName: "Nom invalide"
                }, worker: { ...req.body, id: req.params.id }
            })
        }
        if (!req.body.mail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.render("pages/addworker.twig", {
                error: {
                    mail: "Email invalide"
                }, worker: { ...req.body, id: req.params.id }
            })
        }
        if (!req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            return res.render("pages/addworker.twig", {
                error: {
                    password: "Mot de passe invalide"
                }, worker: { ...req.body, id: req.params.id }
            })
        }
        if (!req.body.age.match(/^\d+$/)) {
            return res.render("pages/addworker.twig", {
                error: {
                    age: "Age invalide"
                }, worker: { ...req.body, id: req.params.id }
            })
        }
        const worker = await prisma.worker.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mail: req.body.mail,
                password: req.body.password,
                age: parseInt(req.body.age, 10),
                gender: req.body.gender,
                company_id: req.session.company.id,

                ...(req.body.computer && req.body.computer !== "" && {

                    computer: {
                        connect: {
                            id: parseInt(req.body.computer)
                        }
                    }
                })
            }
        })
        res.redirect("/")
    } catch (error) {
        console.log(error);

        const worker = await prisma.worker.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })
    }
}