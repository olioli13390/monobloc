const { PrismaClient } = require("../../generated/prisma")
const prisma = new PrismaClient({})

exports.getHome = async (req, res) => { // affiche dashboard + load workers
    try {
        const company = await prisma.company.findUnique({
            where: {
                siret: req.session.company.siret
            },
            include: {
                workers: {
                    include: {
                        computer: true
                    }
                },
                computers: {
                    include: {
                        worker: true
                    }
                }
            }
        })
        res.render('pages/home.twig', { company: req.session.company, workers: company.workers, computers: company.computers })
    } catch (error) {
        console.log(error);
    }
}

exports.getAddWorker = async (req, res) => { // affiche la page addworker
    try {
        const company = await prisma.company.findUnique({
            where: {
                siret: req.session.company.siret
            },
            include: {
                computers: true
            }
        })
        res.render('pages/addworker.twig', { company: req.session.company, computers: company.computers, })
    } catch (error) {
        console.log(error);
    }
}

exports.getAddComputer = async (req, res) => { // affiche la page addcomputer
    res.render("pages/addcomputer.twig", { company: req.session.company })

}
