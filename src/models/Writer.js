const mongoose = require('mongoose');
const User = require('./User');
const Story = require('./Story');

const writerSchema = mongoose.Schema({
   user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   blocked_users: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],
   stories: [
      {
         type: mongoose.Schema.Types.ObjectId, ref: 'Story'
      }
   ]
});

const Writer = mongoose.model('Writer', writerSchema);

module.exports = Writer;