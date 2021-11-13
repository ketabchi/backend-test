'use strict';

const router = require('express').Router();
const amw = require('../utils/async-middleware');
const OrderInterceptor = require('../interceptors/order');

router.patch('/orders/ship', amw(async (req, res) => {
	await OrderInterceptor.shipReady(req.query.status);
	res.json({success: true});
}));

module.exports = router;