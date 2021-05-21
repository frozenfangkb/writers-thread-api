const express = require('express');
const auth = require('../middleware/auth');
const storyController = require('../controllers/storyController');
const validateBody = require('../middleware/validateBody');
const validateQuery = require('../middleware/validateQuery');
const router = express.Router();

router.use(auth);
router.get('/fetch', storyController.getStories);
router.get('/list', storyController.listStories);
router.post('/newStory', validateBody(['title', 'storyBody', 'genre', 'isDraft']), storyController.postStory);
router.post('/updateStory', validateBody(['storyId', 'title', 'genre', 'published']), storyController.updateStory);
router.get('/get', validateQuery(['storyId']), storyController.getStory);
router.get('/delete', validateQuery(['storyId']), storyController.deleteStory);

module.exports = router