'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const async = require('async');
const Promise = require('bluebird');
const bp = require('body-parser');
require('./app/models/product');
require('./app/models/publisher');
require('./app/models/person');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/ketabchi_problems', {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Pragma', 'no-cache');
	next();
});

const routes = require('./app/routes');

function parallel(middlewares) {
	return function (req, res, next) {
		async.each(middlewares, function (mw, cb) {
			mw(req, res, cb);
		}, next);
	};
}

app.use('/', parallel(routes));

app.use(function (req, res) {
	res.sendStatus(404);
});

// eslint-disable-next-line no-unused-vars
app.use(function (err, _, res, next) {
	let status = 500;
	if (err.toString().includes('404')) {
		status = 404;
	}

	console.log(err);
	return res.status(status).json({error: err.toString()});
});

app.listen(3003);

module.exports = app;
