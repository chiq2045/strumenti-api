require('dotenv').config()
const { app } = require('./app')

const { PORT: port } = process.env;
app.listen(port, () => console.log(`listening on port ${port}`))
