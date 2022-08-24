import express from 'express';
import { env } from 'process';
import bodyParser from 'body-parser';
const app = express();

app.use(bodyParser.json());
require("./controllers/index")(app);


app.listen(env.PORT)
console.log("[ API ] Listening on PORT " + env.PORT);