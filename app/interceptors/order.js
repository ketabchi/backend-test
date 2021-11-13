const Order = require('../models/order');
const Product = require('../models/product');

class OrderInterceptor {
	// Problem 3

	async shipReady(status) {
		let orders = await Order.find({status})
			.populate({path: 'items.product'})
			.sort({'createdAt': 1});

		let skip = false;
		for (let order of orders) {
			skip = false;
			for (let item of order.items) {
				let p = await Product.findOne({_id: item.product._id});
				if (item.quantity > p.stockCount) {
					skip = true;
					break;
				}
			}
			if (!skip) {
				await this.ship(order);
			}
		}
	}

	async ship(order) {
		for (let item of order.items) {
			await Product.updateOne(
				{_id: item.product._id},
				{$inc: {stockCount: -item.quantity}}
			);
		}
		await Order.updateOne({_id: order._id}, {status: 'shiped'});
	}
}

module.exports = new OrderInterceptor();
