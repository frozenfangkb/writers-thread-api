const mongoose = require('mongoose')

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
