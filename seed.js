/* eslint-disable no-console */
const mongoose = require('mongoose');
const path = require('path');
const { Seeder } = require('mongo-seeding');
const Product = require('./app/models/product');
const Publisher = require('./app/models/publisher');
const Person = require('./app/models/person');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ketabchi_problems', {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

const seeder = new Seeder({
	database: {
		name: 'ketabchi_problems',
		host: 'localhost'
	},
	dropDatabase: true,
});
const collections = seeder.readCollectionsFromPath(path.resolve('./seeds'));

const products = {
	'1001': {authors: [], publisher: '1001'},
	'1002': {authors: ['1001'], publisher: '1001'},
	'1003': {authors: ['1001', '1002'], publisher: '1002'},
	'1004': {authors: ['1003'], publisher: '1002'},
	'1005': {authors: ['1003', '1004'], publisher: '1002'},
	'1006': {authors: ['1002'], publisher: '1001'},
	'1007': {authors: ['1001'], publisher: '1001'}
};

seeder.import(collections)
	.then(async () => {
		for (const code in products) {
			let publisher = await Publisher.findOne({code: products[code].publisher});
			let authors = await Person.find({code: {$in: products[code].authors}});

			await Product.updateOne({code}, {$set: {
				'details.publisher': publisher,
				'details.authors': authors
			}});
		}

		console.log('Successfully seeded');
		mongoose.connection.close();
	})
	.catch(err => {
		console.log('Error', err);
	});
