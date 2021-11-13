'use strict';

let app = require('./app');
let supertest = require('supertest');

let server = supertest.agent(app);

module.exports = server;
