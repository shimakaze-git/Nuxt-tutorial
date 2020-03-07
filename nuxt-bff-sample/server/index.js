const express = require('express')
const consola = require('consola')
const bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')
const { Strategy } = require('passport-github2')

const { Nuxt, Builder } = require('nuxt')
const app = express()

// requestでjsonを扱えるように設定
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// sessionの設定
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
    secure: 'auto',
    // 生存期間（単位：ミリ秒）
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30日
  }
}))

// Passport.jsの設定
app.use(passport.initialize())
app.use(passport.session())

passport.use(new Strategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/github/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      return done(null, profile)
    })
  }
))
  
passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    name: user.username,
    avatarUrl: user.photos[0].value
  })
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})

app.get('/auth/login/github', passport.authenticate('github', { scope: ['user:email'] }))
app.get('/api/auth/github/callback',
  passport.authenticate('github'),
  (req, res) => {
    console.log('req')
    res.json({ user: req.user })
  }
)

app.get('/auth/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

app.get('/api/session', (req, res) => {
  res.json({ user: req.user })
})

app.get('/hello', (req, res) => {
  res.send('world')
})

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
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
