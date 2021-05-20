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
    published: {
        type: Boolean,
        default: false
    },
    visualizations: {
        type: Number,
        default: 0
    },
    parts: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'StoryPart'
    }]
}, { timestamps: true });

const Story = mongoose.model('Story', storySchema);

module.exports = Story;