require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';


const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', routes);

app.get('/', (req, res) => res.send('Hello World!!!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
