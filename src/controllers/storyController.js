const Story = require("../models/Story");
const StoryPart = require("../models/StoryPart");
const Writer = require("../models/Writer");
const db = require("../db/db");

module.exports = {
  getStories: async (req, res) => {
    await db.connectToDb();
    const user_id = req.query.uid ? req.query.uid : req.user._id;

    try {
      const writer = await Writer.findOne({
        user_id: user_id,
      }).exec();

      if (!writer) {
        await db.disconnectFromDb();
        return res.status(404).send({
          message: "Writer profile not found",
        });
      }

      if (writer.stories.length < 1) {
        await db.disconnectFromDb();
        return res.status(200).send({
          stories: [],
        });
      }

      let stories = [];

      for (const storyId of writer.stories) {
        const story = await Story.findById(storyId);

        if (story) {
          stories.push(story);
        }
      }
      await db.disconnectFromDb();
      return res.status(200).send({
        stories: stories,
      });
    } catch (error) {
      await db.disconnectFromDb();
      console.log(`Error retrieving one story: ${error.message}`);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  },

  postStory: async (req, res) => {
    await db.connectToDb();
    try {
      const story = new Story({
        title: req.body.title,
        writer_id: req.user._id,
        genre: req.body.genre,
        parts: [],
        collaborators: [req.user._id],
      });

      await story.save();

      const storyPart = new StoryPart({
        user_id: req.user._id,
        story_id: story._id,
        approved: true,
        draft: req.body.isDraft,
        text: req.body.storyBody,
      });

      await storyPart.save();

      story.parts.push(storyPart._id);
      await story.save();

      const writer = await Writer.findOne({
        user_id: req.user._id,
      }).exec();

      if (!writer) {
        const newWriterProfile = new Writer({
          user_id: req.user._id,
          stories: [story._id],
        });
        await newWriterProfile.save();
      } else {
        let writerStories = writer.stories;
        writerStories.push(story._id);

        await writer.updateOne(
          {
            user_id: writer.user_id,
          },
          {
            stories: writerStories,
          }
        );
        await writer.save();
      }

      await db.disconnectFromDb();
      return res.status(200).send({
        story,
      });
    } catch (error) {
      await db.disconnectFromDb();
      console.log(`got an error saving a new story: ${error.message}`);
      return res.status(500).send({
        message: "Internal server error",
      });
    }
  },

  getStory: async (req, res) => {
    await db.connectToDb();
    try {
      const story = await Story.findById(req.query.storyId);

      if (!story) {
        await db.disconnectFromDb();
        return res.status(404).send({
          message: "Story not found",
        });
      }

      if (story.parts.length < 1) {
        await db.disconnectFromDb();
        throw new Error(
          `Story with id ${story._id} hasn't got parts!! This shouldn't happen`
        );
      }

      story.visualizations += 1;

      await story.updateOne({
        story,
      });
      await story.save();

      let fetchedParts = [];

      for (const part of story.parts) {
        const storyPart = await StoryPart.findById(part);
        fetchedParts.push(storyPart);
      }

      story.parts = fetchedParts;

      await db.disconnectFromDb();
      return res.status(200).send({
        story,
      });
    } catch (error) {
      await db.disconnectFromDb();
      console.log(`Error getting one story: ${error.message}`);
      return res.status(500).send({
        message: "Internal server error",
      });
    }
  },

  listStories: async (req, res) => {
    await db.connectToDb();
    try {
      const stories = await Story.find();
      await db.disconnectFromDb();
      return res.status(200).send({
        stories: stories,
      });
    } catch (error) {
      await db.disconnectFromDb();
      console.log(`Error retrieving stories: ${error.message}`);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  },

  updateStory: async (req, res) => {
    await db.connectToDb();
    try {
      const story = await Story.findById(req.body.storyId);

      if (!story) {
        await db.disconnectFromDb();
        return res.status(404).send({
          message: "Story not found",
        });
      }

      if (!story.writer_id.equals(req.user._id)) {
        await db.disconnectFromDb();
        return res.status(403).send({
          message: "You're not allowed to modify an story that isn't yours",
        });
      }

      await story.updateOne({
        title: req.body.title,
        genre: req.body.genre,
        published: req.body.published,
      });
      await story.save();

      await db.disconnectFromDb();
      return res.status(200).send();
    } catch (error) {
      await db.disconnectFromDb();
      console.log(`Error updating story: ${error}`);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  },

  deleteStory: async (req,res) => {
      await db.connectToDb();
      try {
          const story = await Story.findById(req.query.storyId);

          if (!story) {
              await db.disconnectFromDb();
              return res.status(200).send();
          }

          if(!story.writer_id.equals(req.user._id)) {
            await db.disconnectFromDb();
            return res.status(403).send({ message: "You're not allowed to delete an story that isn't yours" });
          }

          await story.deleteOne();
          await db.disconnectFromDb();
          return res.status(200).send();
      } catch (error) {
        await db.disconnectFromDb();
        console.log(`Error deleting story: ${error}`);
        res.status(500).send({
          message: "Internal server error",
        });
      }
  }
};
