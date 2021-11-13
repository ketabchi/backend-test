'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
	code: {type: String, unique: true, index: true},
	status: {type: String, required: true},
	items: [{
		_id: false,
		product: {type: Schema.ObjectId, ref: 'Product'},
		unitPrice: Number,
		originalUnitPrice: Number,
		quantity: Number,
		totalPrice: Number,
	}],
}, {
	toObject: {virtuals: true},
	toJSON: {virtuals: true},
	timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}
});

module.exports = mongoose.model('Order', orderSchema);
