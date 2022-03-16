// Importation du package de cryptage des mots de passe
const bcrypt = require("bcrypt");
// Importation du package qui permet de créer et de vérifier les tokens d'authentification
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Importation Avatar Generetor
const avatar = require("generate-avatar");

exports.signup = (req, res, next) => {

    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({
            error: "Données oubliées !"
        });
    }

    // Regex pour exiger un mot de passe fort d'au moins 8 caractères dont une majuscule, des chiffres et un caractère spécial
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9\d@$!%*?&]{8,}$/;
    const password = req.body.password;

    if (password.match(regex)) {
        bcrypt
            .hash(password, 10)
            .then((hash) => {
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    avatar: avatar.generateFromString(req.body.email)
                });
                user
                    .save()
                    .then(() => res.status(201).json({
                        message: "Utilisateur créé !"
                    }))
                    .catch((error) => res.status(403).json({
                        error
                    }));
            })
            .catch((error) => res.status(500).json({
                error
            }));
    } else {
        throw new Error("Le mot de passe n'est pas assez sécurisé");
    }
};

exports.login = (req, res, next) => {
    User
        .findOne({
            email: req.body.email
        })
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                error: "Utilisateur non trouvé !"
                });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            error: "Mot de passe incorrect !"
                        });
                    }

                    const token = jwt.sign({
                        userId: user._id
                    }, process.env.SECRET_TOKEN, {
                        expiresIn: "24h",
                        algorithm: "HS256"
                    });

                    res.cookie('token', token, { httpOnly: true });

                    res.status(200).json({
                        userId: user._id,
                        token,
                    });
                })
                .catch((error) => res.status(500).json({
                    error
                }));
        })
        .catch((error) => res.status(500).json({
            error
        }));
};

exports.getToken = (req, res) => {
    const { token } = req.cookies;
    res.json({ token })
}

exports.getUser = async (req, res) => {
    const { token } = req.cookies;
    const { userId } = jwt.decode(token, process.env.SECRET_TOKEN, { algorithms: [ 'HS256' ] })
    const user = await User.findById(userId);

    res.json(user);
}