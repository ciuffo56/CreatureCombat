const express = require('express')
const app = express()
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
const battleRouter = require('./routes/battle')
const resultRouter = require('./routes/winLoss')

const mongoURI = 'mongodb+srv://ciuffo56:ccPassword@creaturecombat.pstdmvc.mongodb.net/creature_combat?retryWrites=true&w=majority'

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

const store = new MongoDBStore({
    uri: mongoURI,
    collection: 'appSessions'
})

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/battle', battleRouter)
app.use('/winLoss', resultRouter)

app.listen(process.env.PORT || 3000)