const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const path = require("path");
const res = require("express/lib/response");
const userRoutes = require("./routes/user");
const assetRoutes = require("./routes/asset");
const auth = require("./middleware/auth");

const {
  Schema,
  model,
  connect
} = mongoose;
let Message = "";
let User = "";

mongoose
  .connect(process.env.MONGOOSE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const messageSchema = new Schema({
      id_user: String,
      message: String,
      date: {
        type: Date,
        default: Date.now
      },
      id_room: String,
    });
    Message = model("Message", messageSchema);
    console.log("Connexion à MongoDB réussie !");
  })
  .catch((e) => console.log("Connexion à MongoDB échouée !"));

//Erreurs de CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
app.use(cookieParser());

//pour sauvegarder les images en back *Créer un dosier "images"
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/auth", userRoutes);
app.use("/", assetRoutes);

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/public/index.html");
// });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});


app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/pages/login.html");
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

app.get("/registration", (req, res) => {
  res.sendFile(__dirname + "/public/pages/registration.html");
});

// Ici on peut authentifier l'utilisateur
io.use(auth)

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);
  socket.broadcast.emit(
    "connected",
    `l'utilisateur ${socket.id} s'est connecté`
  );

  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: socket.id,
      username: socket.id,
      userPic: "https://github.com/mdo.png"
    });
  }
  socket.emit("users", users);

  socket.on("enter_room", (room) => {
    // On entre dans la salle demandée
    socket.join(room);
    Message.find({
      id_room: room
    }, function (err, messages) {
      if (err) throw err;
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        socket.emit("message", message);
      }
    });
  });

  // On écoute les sorties dans les salles
  socket.on("leave_room", (room) => {
    // On quitte la salle
    socket.leave(room);
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });

  socket.on("message", (data) => {
    data.date = new Date();
    const {
      message,
      date,
      room
    } = data;
    const msg = Message.create({
        id_user: socket.id,
        message,
        date,
        id_room: room,
      })
      .then(() => {
        io.to(data.room).emit("message", data);
        // Le message est stocké, on le relaie à tous les utilisateurs dans le salon correspondant
      })
      .catch((e) => {
        console.log(e);
      });
  });
});

server.listen(8080, () => {
  console.log("Listening on PORT: 8080");
});
