const Story = require('../models/Story');
const Writer = require('../models/Writer');

module.exports = {
    getStories: async (req, res) => {
        const user_id = req.query.uid ? req.query.uid : req.user._id;

        try {
            const writer = await Writer.findOne({ user_id: user_id }).exec();

            if(!writer)
                return res.status(404).send({ message: "Writer profile not found" });
            
            if(writer.stories.length < 1)
                return res.status(200).send({stories: []});
            
            let stories = [];

            for(const storyId of writer.stories) {
                const story = await Story.findById(storyId);

                if(story)
                    stories.push(story);
            }

            return res.status(200).send({ stories: stories });
            
        } catch (error) {
            console.log(`Error retrieving stories: ${error}`);
            res.status(500).send({ message: "Internal server error" });
        }
    },

    postStory: async (req,res) => {
        try {
            const story = new Story({
                title: req.body.title,
                body: req.body.storyBody,
                genre: req.body.genre,
                collaborators: [req.user._id]
            });

            await story.save();

            const writer = await Writer.findOne({ user_id: req.user._id }).exec();

            if(!writer) {
                const newWriterProfile = new Writer({ user_id: req.user._id, stories: [story._id] });
                await newWriterProfile.save();
            } else {
                let writerStories = writer.stories;
                writerStories.push(story._id);

                await writer.updateOne({ user_id: writer.user_id }, {stories: writerStories});
                await writer.save();
            }

            return res.status(200).send({story});
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: "Internal server error" });
        }
    }
}
