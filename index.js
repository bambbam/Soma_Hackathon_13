const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express()
const port = 3000
//app.set('view engine','ejs')


app.engine('html',require('ejs').renderFile)
app.set('views',__dirname+'/views');
app.use(express.static(__dirname + '/views/static'));

const favicon = require('serve-favicon');
const path = require("path");
app.use(favicon(path.join(__dirname, 'favicon.ico')));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser());

app.set('port',process.env.PORT || 3000);



/*
app.use(session({
 secret: '@#@$MYSIGN#@$#$',
 resave: false,
 saveUninitialized: true
}));
*/

//const path = require('path')

//const indexRouter = require('./routes');
//const userRouter = require('./routes/user');
const kakaoRouter = require('./routes/kakaoFramework')
//app.use('/', indexRouter);
//app.use('/user', userRouter);
app.use('/',kakaoRouter);
//app.use('/kakao/sample1',kakaoRouter);
app.use((req,res,next)=>{    res.status(400).send('NOT FOUND');
})

app.listen(app.get('port'),()=>{
    console.log(app.get('port'), '번 포트에서 대기중')
})