const mongoose = require('mongoose');

const storySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    collaborators: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        }
    ],
    genre: {
        type: String,
        required: true
    },
    body: {
        type: String,
        maxLength: 280
    }
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;