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
                    },
                    orderBy: {
                        lastName: "asc"
                    }
                },
                computers: {
                    include: {
                        worker: true
                    }
                }
            }
        })
        const formattedCreateAt = company.createdAt.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })

        company.formattedCreateAt = formattedCreateAt

        const recentWorkers = await prisma.worker.findMany({
            where: {
                company_id: company.id
            },
            include: {
                computer: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 3
        })

        const formattedRecentWorkers = recentWorkers.map(worker => {
            const formattedWorkerCreateAt = worker.createdAt.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            return {
                ...worker,
                formattedWorkerCreateAt: formattedWorkerCreateAt
            }
        })

        const files = await prisma.file.findMany({
            where: {
                company_id: company.id
            },
            orderBy: {
                uploadAt: 'desc'
            },
            take: 3
        })

        const formattedFiles = files.map(file => ({
            ...file,
            formattedUploadAt: file.uploadAt.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
        }))

        res.render('pages/home.twig', { company: company, workers: company.workers, computers: company.computers, recentWorkers: formattedRecentWorkers, files: formattedFiles })
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
                computers: {
                    include: {
                        worker: true
                    }
                }
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

exports.getAddCsv = async (req, res) => { // affiche addcsv
    res.render("pages/addcsv.twig", { company: req.session.company })
}
