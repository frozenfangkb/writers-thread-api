const mongoose = require('mongoose');
const StoryPart = require('./StoryPart');

const storySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    writer_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
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

storySchema.pre('deleteOne', async (next) => {
    const id = this.getQuery()['_id'];

    const partsIds = this.parts;
    await StoryPart.deleteMany({ story_id: { $in: partsIds } });
    next();
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;