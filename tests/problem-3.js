'use strict';

require('should');
const server = require('../test-config');
const Order = require('../app/models/order');
const Product = require('../app/models/product');

describe('problem 3', function () {
	beforeEach(async () => {
		await Order.deleteMany();

		await Product.updateOne({code: '1001'}, {$set: {stockCount: 10}});
		await Product.updateOne({code: '1002'}, {$set: {stockCount: 7}});
		await Product.updateOne({code: '1003'}, {$set: {stockCount: 0}});
		await Product.updateOne({code: '1004'}, {$set: {stockCount: 2}});
		await Product.updateOne({code: '1005'}, {$set: {stockCount: 1}});
		await Product.updateOne({code: '1006'}, {$set: {stockCount: 0}});
		await Product.updateOne({code: '1007'}, {$set: {stockCount: 0}});

		const p5 = await Product.findOne({code: '1005'}),
			p4 = await Product.findOne({code: '1004'}),
			p2 = await Product.findOne({code: '1002'}),
			p1 = await Product.findOne({code: '1001'});

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
					},
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
				code: '1003',
				status: 'registered',
				items: [
					{
						product: p2,
						unitPrice: p2.price,
						quantity: 2,
						totalPrice: p2.price * 2
					},
					{
						product: p1,
						unitPrice: p1.price,
						quantity: 3,
						totalPrice: p1.price * 3
					}
				]
			},
			{
				code: '1004',
				status: 'registered',
				items: [
					{
						product: p4,
						unitPrice: p4.price,
						originalUnitPrice: p4.originalPrice,
						quantity: 1,
						totalPrice: p4.price * 2
					},
				]
			}
		]);
	});

	it('should mark orders ready which we have their items in our stock', async () => {
		await server.patch('/orders/ship?status=registered')
			.set('accept', 'application/json')
			.expect(200)
			.expect('content-type', 'application/json; charset=utf-8');

		const p5 = await Product.findOne({code: '1005'}),
			p4 = await Product.findOne({code: '1004'}),
			p2 = await Product.findOne({code: '1002'}),
			p1 = await Product.findOne({code: '1001'});
		p5.stockCount.should.equal(0);
		p4.stockCount.should.equal(1);
		p2.stockCount.should.equal(5);
		p1.stockCount.should.equal(7);

		const o1 = await Order.findOne({code: '1001'}),
			o2 = await Order.findOne({code: '1002'}),
			o3 = await Order.findOne({code: '1003'}),
			o4 = await Order.findOne({code: '1004'});
		o1.status.should.equal('shiped');
		o2.status.should.equal('registered');
		o3.status.should.equal('shiped');
		o4.status.should.equal('shiped');
	});

	it('should not allow shipping and decreasing order items multiple times', async () => {
		// Problem 3
	});
})