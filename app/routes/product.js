'use strict';

const router = require('express').Router();
const amw = require('../utils/async-middleware');
const ProductInterceptor = require('../interceptors/product');

router.post('/products', amw(async (req, res) => {
	const {page , page_url, page_unique} = req.body;
	const result = await ProductInterceptor.search(page, page_url, page_unique);

	res.json(result);
}));

module.exports = router;
