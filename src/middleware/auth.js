const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../db/db');

const auth = async (req, res, next) => {
   await db.connectToDb();
   if (!req.header('Authorization')) {
      res.status(403).send({ error: "A valid token must be specified" });
   }
   const token = req.header('Authorization').replace('Bearer ', '');
   const data = jwt.verify(token, process.env.JWT_KEY);
   try {
      const user = await User.findOne({ _id: data._id, 'tokens.token': token })
      if (!user) {
         throw new Error();
      }
      req.user = user;
      req.token = token;
      await db.disconnectFromDb();
      next();
   } catch (error) {
      await db.disconnectFromDb();
      res.status(401).send({ error: 'Not authorized to access this resource' });
   }

}
module.exports = auth;