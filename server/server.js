require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const httpserver = require("http-server");
const helmet = require("helmet");
const passport = require("passport");

const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");
const contextAuthRoutes = require("./routes/context-auth.route");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cors());

const PORT = process.env.PORT;

app.get('/', (req, res) => {
   res.send('Welcome! 5000 server.');
});

app.get("/server-status", (req, res) => {
    res.status(200).json({status:1, message: "Server is up and running!" });
});


app.use("/auth", contextAuthRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);


// process.on("SIGINT", async () => {
//     try {
//       await db.disconnect();
//       console.log("Disconnected from database.");
//       process.exit(0);
//     } catch (err) {
//       console.error(err);
//       process.exit(1);
//     }
//   });

// Mongoose Setup
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(PORT, () =>  console.log(`Server is running on port ${PORT}`));

    // Only run first time when running app to insert data into mongodb
    /**
      ***********************************************
        User.insertMany(dataUser);
      ***********************************************
    */
  })
  .catch((error) => console.log(`${error} did not connect.`));