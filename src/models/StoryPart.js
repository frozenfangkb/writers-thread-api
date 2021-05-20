const mongoose = require('mongoose');

const storyPartSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    story_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Story'
    },
    approved: {
        type: Boolean,
        default: false
    },
    draft: {
        type: Boolean,
        default: true
    },
    text: {
        type: String,
        trim: true,
        maxLength: 500
    }
}, { timestamps: true });

const StoryPart = mongoose.model('StoryPart', storyPartSchema);

module.exports = StoryPart;