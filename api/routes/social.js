const express = require('express');
const { 
  getAccessToken, 
  authenticate, 
  shareContent 
} = require('../controllers/linkedin')

const router = express.Router();

router.get('/accesstoken', getAccessToken)
router.get('/auth', authenticate)
router.post('/share', shareContent)

module.exports = router;