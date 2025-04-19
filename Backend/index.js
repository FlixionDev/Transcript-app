process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const cors = require('cors');
const { connection } = require('./Configs/db');
const { userRouter } = require('./Routes/Users.Route');
const { authenticateUser } = require("./middleware/authenticate.middleware");
const { TranscriptRouter } = require('./Routes/Transcript.Route');
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome Transcript App');
});
app.use("/user", userRouter);
app.use(authenticateUser);
app.use("/transcript", TranscriptRouter);

app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log('Connected to DB');
    } catch (err) {
        console.log('Something went wrong');
        console.log(err);
    }
    console.log(`Server is running on port number ${process.env.PORT}`);
});
