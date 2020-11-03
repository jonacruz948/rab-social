const express = require('express');
const { find, view } = require('../controllers/search');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', find)
router.post('/view', auth, view)

module.exports = router;