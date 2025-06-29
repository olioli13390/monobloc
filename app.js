const express = require("express")
const session = require("express-session")
const companyRoutes = require("./src/routes/companyRoutes")
const mainRoutes = require("./src/routes/mainRoutes")
const workerRoutes = require("./src/routes/workerRoutes")
const computerRoutes = require("./src/routes/computerRoutes")
const fileRoutes = require('./src/routes/fileRoutes')

const app = express()

app.set('views', './src/views')
app.use(express.static("./public"))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: "olivier",
    resave: true,
    saveUninitialized: true,
}))

app.use(companyRoutes)
app.use(mainRoutes)
app.use(workerRoutes)
app.use(computerRoutes)
app.use(fileRoutes)

app.listen(process.env.PORT, () => {
    console.log("Ecoute le port");
})