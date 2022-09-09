import express from 'express';
import { env } from 'process';
import bodyParser from 'body-parser';
import { refresher } from './middlewares/refresherMiddleware';
const app = express();

app.use(bodyParser.json());
app.use(refresher);
require("./controllers/index")(app);

app.listen(env.PORT)
console.log("[ API ] Listening on PORT " + env.PORT);