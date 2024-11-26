const express = require('express')

const db = require('./config.js')

const {handleUser} = require('./controller/controller.js')

const port = 7001

const app = express()

handleUser()

db.query('select 1')
.then(() => app.listen(port, () => console.log("server started at", port)))
.catch((err) => console.error(err))

