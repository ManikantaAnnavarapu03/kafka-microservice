const express = require('express')

const app = express()

const port = 7003

app.listen(port, () => console.log("server started at", port))