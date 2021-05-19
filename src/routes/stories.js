const express = require('express');
const auth = require('../middleware/auth');
const storyController = require('../controllers/storyController');
const validateBody = require('../middleware/validateBody');
const router = express.Router();

router.use(auth);
router.get('/own', storyController.getStories);
router.post('/newStory', validateBody(['title', 'storyBody', 'genre']), storyController.postStory)

module.exports = router