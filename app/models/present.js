'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const presentSchema = new Schema({
	// Problem 2
}, {
	toObject: {virtuals: true},
	toJSON: {virtuals: true},
	timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}
});

module.exports = mongoose.model('Present', presentSchema);
