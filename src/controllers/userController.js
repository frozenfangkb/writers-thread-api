const User = require('../models/User')
const db = require('../db/db');

module.exports = {
    UserRegister: async (req, res) => {
       await db.connectToDb();
        // Create a new user
        try {
           const user = new User(req.body)
           await user.save()
           const token = await user.generateAuthToken()
           await db.disconnectFromDb();
           res.status(201).send({ user, token })
        } catch (error) {
           await db.disconnectFromDb();
           res.status(400).send(error)
        }
    },
    UserLogin: async (req, res) => {
      await db.connectToDb();
        //Login a registered user
        try {
           const { email, password } = req.body
           const user = await User.findByCredentials(email, password)
           if (!user) {
              return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
           }
           const token = await user.generateAuthToken()
           await db.disconnectFromDb();
           res.send({ user, token })
        } catch (error) {
           await db.disconnectFromDb();
           res.status(400).send(error)
        }
     
    },
    userProfile: async (req, res) => {
        // View logged in user profile
        res.send(req.user)
    },
    userLogout: async (req, res) => {
      await db.connectToDb();
        // Log user out of the application
        try {
           req.user.tokens = req.user.tokens.filter((token) => {
              return token.token != req.token
           })
           await req.user.save()
           await db.disconnectFromDb();
           res.send()
        } catch (error) {
           await db.disconnectFromDb();
           res.status(500).send(error)
        }
    },
    userLogoutAllDevices: async (req, res) => {
      await db.connectToDb();
        // Log user out of all devices
        try {
           req.user.tokens.splice(0, req.user.tokens.length)
           await req.user.save()
           await db.disconnectFromDb();
           res.send()
        } catch (error) {
           await db.disconnectFromDb();
           res.status(500).send(error)
        }
    }
}