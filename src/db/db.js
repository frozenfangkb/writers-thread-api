const mongoose = require('mongoose')

module.exports = {
   connectToDb: async () => {
      await mongoose.connect(process.env.MONGODB_URL, {
         useNewUrlParser: true,
         useCreateIndex: true,
         useUnifiedTopology: true
      }, (err) => {
         if (err) {
            console.log(err);
         }
      });
   },

   disconnectFromDb: async () => {
      await mongoose.connection.close();
   }
}
