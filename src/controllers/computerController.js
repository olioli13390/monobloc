const { PrismaClient } = require('../../generated/prisma')
const hashPasswordExtensions = require("../services/extensions/hashPassword")
const prisma = new PrismaClient({})
const session = require("express-session")


exports.postComputer = async (req, res) => { // créer un pc
    try {
        if (!req.body.adress.match(/^([0-9A-Za-z]{2}[:-]){4}([0-9A-Za-z]{2})$/
        )) {
            return res.render('pages/addcomputer.twig', {
                error: {
                    adress: "Adresse mac invalide"
                },
                company: req.session.company
            })
        }
        const computer = await prisma.computer.create({
            data: {
                adress: req.body.adress,
                company_id: req.session.company.id,
            }
        })
        res.redirect('/')
    } catch (error) {
        console.log(error);
        res.render('pages/addcomputer.twig', {
            error: { adress: "Adresse mac invalide" },
            company: req.session.company
        })
    }
}

exports.deleteComputer = async (req, res) => { // delete pc
    try {
        const computer = await prisma.computer.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.redirect("/")
    } catch (error) {
        console.log(error);
    }
}

exports.getUpdateComputer = async (req, res) => { // affiche la modif
    try {
        const computer = await prisma.computer.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.render('pages/addcomputer.twig', { computer, company: req.session.company })
    } catch (error) {
        console.log(error);
    }
}

exports.postUpdateComputer = async (req, res) => { // post update computer
    try {
        if (!req.body.adress.match(/^([0-9A-Fa-f]{2}[:-]){4}([0-9A-Fa-f]{2})$/
        )) {
            throw ({ adress: "Adresse MAC invalide" })
        }
        const computer = await prisma.computer.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                adress: req.body.adress,
                company_id: req.session.company.id,
            }
        })
        res.redirect('/')

    } catch (error) {
        console.log(error);

    }
}