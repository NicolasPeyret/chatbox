const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// On crée le middleware qui va authentifié
// le token présent dans le header

module.exports = async (socket, next) => {
    try {
        console.log('Tarte aux pommes')

        const { token } = socket.handshake.auth;

        const decodedToken = jwt.verify(
            token, 
            process.env.SECRET_TOKEN, 
            { 
                algorithms: [ 'HS256' ] 
            }
        );

        const { userId } = decodedToken;

        socket.user = await User.findById(userId);

        next();
    } catch (error) {
        console.error(error);
        next(error)
    }
};