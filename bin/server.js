var express = require('express')
var app = express()

app.listen(3000, () => console.log('Listening on port 3000'))

app.use(express.static('./'))
app.use(express.static('./etc'))
