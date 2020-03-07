const express = require('express')
const router = express.Router()

router.get('/user', (req, res) => {
  console.log('req.user : ', req.user)
  if(req.user) {
    res.send(req.user)
  } else {
    console.log('セッションがありません')
    // res.redirect('/')
  }
})
  
module.exports = router
