const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = function (schema, {entityName, fieldName = 'image'} = {}) {
	let imageSchema = new Schema({
		_id: false,
		name: String,
		thumbName: String
	}, {
		toObject: {virtuals: true},
		toJSON: {virtuals: true},
		timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'},
	});

	imageSchema.virtual('url').get(function () {
		let path = this.parent().code;
		if (entityName === 'product') {
			path = path + '/images';
		}
		return `https://ketabchi.com/${entityName}s/${path}/${this.name}`;
	});

	imageSchema.virtual('thumbURL').get(function () {
		let path = this.parent().code;
		if (entityName === 'product') {
			path = path + '/images';
		}
		return `https://ketabchi.com/${entityName}s/${path}/${this.thumbName}`;
	});

	imageSchema.$implicitlyCreated = true;
	schema.add({
		[fieldName]: imageSchema
	});
};
