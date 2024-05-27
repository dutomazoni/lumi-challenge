import express from 'express';
import routes from './Routes/index';
import cors from 'cors'
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from "path";

dotenv.config({ path: path.join(__dirname, '.env') });
let app = express();
app.use(cors());

app.use(bodyParser.json({limit: '100mb'}));
app.use(routes);
let port = process.env.PORT || 5001

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

export {app};
