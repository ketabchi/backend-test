'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const imagePlugin = require('../utils/image-plugin');

const productSchema = new Schema({
	code: {type: String, unique: true, index: true},
	status: {type: String, required: true},
	scope: {type: String, required: true},
	title: {type: String, required: true},
	name: {type: String, required: true},
	slug: {type: String, required: true},
	stockCount: {type: Number, default: 0},
	price: {type: Number, default: 0},
	originalPrice: {type: Number, default: 0},
	details: {
		publisher: {type: Schema.ObjectId, ref: 'Publisher', index: true},
		authors: {type: [{type: Schema.ObjectId, ref: 'Person'}], index: true},
		pages: Number,
		size: String,
		cover: String,
	}
}, {
	toObject: {virtuals: true},
	toJSON: {virtuals: true},
	timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'},
});

productSchema.virtual('webURLRel').get(function () {
	return `/product/${this.code}/${encodeURIComponent(this.slug)}`;
});
productSchema.virtual('webURL').get(function () {
	return `https://ketabchi.com${this.webURLRel}`;
});

productSchema.plugin(imagePlugin, {entityName: 'product'});
module.exports = mongoose.model('Product', productSchema);
