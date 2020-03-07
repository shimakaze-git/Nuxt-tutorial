const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

// 追記
// ここから ************************************************
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mypageRouter = require('../routes/mypage')
const signinRouter = require('../routes/signin')
const bodyParser = require('body-parser')
const { Strategy } = require('passport-github2')
// const routes = express.Router()

//後ほどここにsession機能記述
const session = require('express-session')
app.use(session({
  // 必須項目（署名を行うために使います）
  secret: process.env.SESSION_SECRET || 'secret',
  // 推奨項目（セッション内容に変更がない場合にも保存する場合にはtrue）
  resave: false,
  // 推奨項目（新規にセッションを生成して何も代入されていなくても値を入れる場合にはtrue）
  saveUninitialized: false,
  // アクセスの度に、有効期限を伸ばす場合にはtrue
  rolling: true,
  // クッキー名（デフォルトでは「connect.sid」)
  // name : 'my-special-site-cookie',
  cookie: {
    // 生存期間（単位：ミリ秒）
    // maxAge : 1000 * 60 * 60 * 24 * 30, // 30日
  }
}))

// console.log('passport', passport)
app.use(passport.initialize())
app.use(passport.session())

// passport.use(new Strategy(
//   {
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: 'http://localhost:3000/callback'
//   },
//   (accessToken, refreshToken, profile, done) => {
//     process.nextTick(() => {
//       return done(null, profile)
//     })
//   }
// ))

//passportとsessionの紐づけ
// passport.serializeUser((user, done) => {
//   done(null, {
//     id: user.id,
//     name: user.username,
//     avatarUrl: user.photos[0].value
//   })
// })  
// passport.deserializeUser((obj, done) => {
//   done(null, obj)
// })

//passportとsessionの紐づけ
passport.serializeUser(function(username, done) {
  console.log('serializeUser', username)
  done(null, username);
})

passport.deserializeUser(function(username, done) {
  console.log('deserializeUser')
  done(null, {name:username})
})

// app.get('/auth/login', passport.authenticate('github', { scope: ['user:email'] }))
// app.get('/auth/callback',
//   passport.authenticate('github'),
//   (req, res) => {
//     res.json({ user: req.user })
//   }
// )
// app.get('/auth/logout', (req, res) => {
//   req.logout()
//   res.redirect('/')
// })

// passportとStrategyの紐づけ
// routes/signin.jsのpassport.authenticate()によって以下の処理が走る。
passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, function (username, password, done) {
    // 入力された名前とパスワード照合
    if (username === "test" && password === "123456789") {
      return done(null, username)
    } else {
      // console.log("error")
      return done(null, false, { message: '入力が正しくありません。' })
    }
  }
))
  
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// sessionCheck
// var sessionCheck = function(req, res, next) {
//   if (req.session.user) {
//     next();
//   } else {
//     res.redirect('/login');
//   }
// }

app.use('/mypage', function(req, res, next) {
  // console.log(req.body)
  if(req.user){
    // user認証済みの実装
    next()
  }else{
    // user確認できない時はホーム画面にリダイレクト
    res.redirect('/')
  }
})
app.use('/api/mypage', mypageRouter)
app.use('/signin', signinRouter)
// app.use('/', sessionCheck, routes)
app.use('/logout', function(req, res, next) {
  req.logout()
  req.session.destroy();
  res.redirect('/')
})

// 追記
// ここまで ************************************************

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
