if (process.env.NODE_ENV === 'dev') {
console.log(process.env.NODE_ENV);
    require('dotenv').config();
}
import Database from './classes/database';
import Server from './classes/server';

Database.instance.start();
Server.instance.start();