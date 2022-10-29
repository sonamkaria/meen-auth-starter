// Dependencies
const express = require("express")
const app = express()

const mongoose = require("mongoose")
const userController = require("./controllers/users")
require("dotenv").config()
const bcrypt = require("bcrypt")
const session = require("express-session")
const methodOverride = require("method-override")
const PORT = process.env.PORT

// Database Configuration
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  
  // Database Connection Error / Success
  const db = mongoose.connection
  db.on("error", (err) => console.log(err.message + " is mongod not running?"))
  db.on("connected", () => console.log("mongo connected"))
  db.on("disconnected", () => console.log("mongo disconnected"))
  

// Middleware
// Body parser middleware: give us access to req.body
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }))

// Routes / Controllers

app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
    })
  )
app.use("/users", userController)
const sessionsController = require("./controllers/sessions")
app.use("/sessions", sessionsController)


//Index
// Routes / Controllers
app.get("/", (req, res) => {
    if (req.session.currentUser) {
      res.render("dashboard.ejs", {
        currentUser: req.session.currentUser,
      })
    } else {
      res.render("index.ejs", {
        currentUser: req.session.currentUser,
      })
    }
  })




// Listener

app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`))