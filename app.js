require('dotenv').config();
const port = process.env.PORT || 8000;
const express = require('express');
const app = express();
const cors = require('cors');
const mongoConnect = require('./config/db');
const userRoutes = require('./Routes/userRoutes');
const path = require("path");


app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);


// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/client/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}

// --------------------------deployment------------------------------

mongoConnect(process.env.MONGO_URL).then(() => {
    app.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    });
}).catch((err) => {
    console.error(err);
    process.exit(1);
});