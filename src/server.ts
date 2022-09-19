import express from 'express';
import { env } from 'process';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(bodyParser.json());
require("./controllers/index")(app);

app.listen(env.PORT)
console.log("[ API ] Listening on PORT " + env.PORT);