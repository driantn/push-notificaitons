require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import Sequelize from 'sequelize';
import SyncModels from './models';
import routes from './routes';

const app = express();
const port = 3000;

app.use(bodyParser.json());

const sequelize = new Sequelize('mainDB', null, null, {
  dialect: "sqlite",
  storage: './database/db.sqlite3',
});

sequelize
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use('/api', routes);

  app.get('/', (req, res) => res.send('Hello World!!!'));

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});
SyncModels();
