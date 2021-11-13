'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const imagePlugin = require('../utils/image-plugin');

const publisherSchema = new Schema({
	code: {type: String, unique: true, index: true},
	name: {type: String, required: true, unique: true}
}, {
	toObject: {virtuals: true},
	toJSON: {virtuals: true},
	timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}
});

publisherSchema.virtual('title').get(function () {
	return `انتشارات ${this.name}`;
});

publisherSchema.plugin(imagePlugin, {entityName: 'publisher'});
module.exports = mongoose.model('Publisher', publisherSchema);
