'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const imagePlugin = require('../utils/image-plugin');

const personSchema = new Schema({
	code: {type: String, unique: true, index: true},
	faName: {type: String, unique: true, sparse: true},
	enName: {type: String, unique: true, sparse: true}
}, {
	toObject: {virtuals: true},
	toJSON: {virtuals: true},
	timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'},
});

personSchema.virtual('name').get(function () {
	return this.faName ? this.faName : this.enName;
});

personSchema.virtual('title').get(function () {
	return this.name;
});

personSchema.plugin(imagePlugin, {entityName: 'person'});
module.exports = mongoose.model('Person', personSchema);
