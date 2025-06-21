const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient();

// Configuration du stockage
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueName + '.csv');
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        const isCSV = file.mimetype === 'text/csv' ||
            file.mimetype === 'application/csv' ||
            path.extname(file.originalname).toLowerCase() === '.csv';

        if (isCSV) cb(null, true);
        else cb(new Error('Seuls les fichiers CSV sont autorisés'));
    }
});

exports.uploadSingle = upload.single('file');

exports.postUploadFile = async (req, res) => {
    try {
        if (!req.file) throw { file: "Aucun fichier CSV fourni" };
        if (!req.file.originalname.match(/\.csv$/i)) {
            throw { file: "Le fichier doit avoir l'extension .csv" };
        }
        if (!req.session.company) {
            throw { session: "Session entreprise requise" };
        }

        const savedFile = await prisma.file.create({
            data: {
                filename: req.file.filename,
                fileRename: req.body.fileRename,
                size: req.file.size,
                path: req.file.path,
                company_id: req.session.company.id
            }
        })

        const workers = []
        const filePath = path.resolve(req.file.path)

        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    if (row.firstName && row.lastName && row.mail) {
                        workers.push({
                            firstName: row.firstName.trim(),
                            lastName: row.lastName.trim(),
                            mail: row.mail.trim().toLowerCase(),
                            age: row.age ? parseInt(row.age, 10) : null,
                            gender: row.gender || null,
                            company_id: req.session.company.id
                        })
                    }
                })
                .on('end', resolve)
                .on('error', reject)
        });

        let created = 0;
        for (const w of workers) {
            const exists = await prisma.worker.findUnique({ where: { mail: w.mail } });
            if (!exists) {
                const passwordHash = await bcrypt.hash('defaultPassword123', 10);
                await prisma.worker.create({
                    data: {
                        ...w,
                        password: passwordHash
                    }
                })
                created++
            }
        }

        res.redirect('/')

    } catch (error) {
        console.log(error)
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Erreur suppression fichier:', err)
            });
        }
        res.status(400).json({ error: error })
    }
}
