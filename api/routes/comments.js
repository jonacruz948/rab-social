const express = require('express');
const { getComments, addComment } = require('../controllers/comments')
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:cardID', getComments);
router.post('/add', auth, addComment);

module.exports = router;