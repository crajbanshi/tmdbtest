import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import helmet from 'helmet';
import expresslogger from 'express-logger';

import { config, db } from './config';
import route from './route';

var accessLogFile = config.accessLogFile;

const app = express();
const port = 3200;

app.use(helmet());
app.use(cors());

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

app.use(expresslogger({ path: accessLogFile }));

app.use('/api', route);
app.use((req,res)=>{
  res.status(404).send({message:"404 not found"})
})
app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});

export default app;