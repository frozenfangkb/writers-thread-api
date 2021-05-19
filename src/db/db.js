const mongoose = require('mongoose')

module.exports = {
   connectToDb: () => {
      mongoose.connect(process.env.MONGODB_URL, {
         useNewUrlParser: true,
         useCreateIndex: true,
         useUnifiedTopology: true
      }, (err) => {
         if (err) {
            console.log(err);
         } else {
            console.log("connected ok to db");
         }
      });
   },

   disconnectFromDb: () => {
      mongoose.connection.close();
   }
}
