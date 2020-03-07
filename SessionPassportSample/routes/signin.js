const express = require('express')
const passport = require('passport')
const router = express.Router()

// ログイン処理を定義
router.post(
  '/',
  passport.authenticate( 'local', {
    successRedirect: '/mypage',
    failureRedirect: '/signin',
    successFlash: true,
    failureFlash: true,
    session: true
  }), 
  function(req, res, next) {
    //認証成功した場合のコールバック
    //成功時のリダイレクトは successRedirect で指定しているので、ここですることは特にないかもしれない。
    next()
  }
)

module.exports = router
