'use strict';

require('should');
const server = require('../test-config');
const Order = require('../app/models/order');
const Present = require('../app/models/present');
const Product = require('../app/models/product');

describe('problem 2', function () {
	before(async () => {
		await Order.deleteMany();
		await Present.deleteMany();

		const p5 = await Product.findOne({code: '1005'});
		const p4 = await Product.findOne({code: '1004'});

		await Order.insertMany([
			{
				code: '1001',
				status: 'registered',
				items: [
					{
						product: p5,
						unitPrice: p5.price,
						originalUnitPrice: p5.originalPrice,
						quantity: 1,
						totalPrice: p5.price * 1
					}
				]
			},
			{
				code: '1002',
				status: 'registered',
				items: [
					{
						product: p4,
						unitPrice: p4.price,
						originalUnitPrice: p4.originalPrice,
						quantity: 2,
						totalPrice: p4.price * 2
					}
				]
			}
		]);
	});

	it('should create present record', async () => {
		const res = await server.post('/present')
			.set('accept', 'application/json')
			.send({
				productCode: '1002',
				conditions: {
					publishers: ['1001'],
					authors: ['1004']
				}
			})
			.expect(200)
			.expect('content-type', 'application/json; charset=utf-8');

		res.body.present.product.code.should.equal('1002');
	});

	it('should get applicaple presents on specific order', async () => {
		const res = await server.get('/presents?orderCode=1001')
			.set('accept', 'application/json')
			.expect(200)
			.expect('content-type', 'application/json; charset=utf-8');

		res.body.products[0].code.should.equal('1002');
	});

	it('should get applicaple presents empty', async () => {
		const res = await server.get('/presents?orderCode=1002')
			.set('accept', 'application/json')
			.expect(200)
			.expect('content-type', 'application/json; charset=utf-8');

		res.body.products.length.should.equal(0);
	});
})