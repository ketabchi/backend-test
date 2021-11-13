'use strict';

require('should');
const server = require('../test-config');
const Product = require('../app/models/product');

describe('problem 1', function () {
	it('should get one product base on page_unique', async () => {
		let expProduct = await Product.findOne({code: '1005'})
			.populate('details.publisher details.authors');

		const res = await server.post('/products')
			.set('accept', 'application/json')
			.send({page_unique: expProduct.code})
			.expect(200)
			.expect('content-type', 'application/json; charset=utf-8');

		const product = res.body;
		product.page_unique.should.equal(expProduct.code);
		product.page_url.should.equal(expProduct.webURL);
		product.image_link.should.equal(expProduct.image.thumbURL);
		product.current_price.should.equal(expProduct.price);
		product.old_price.should.equal(expProduct.originalPrice);
		product.status.should.equal(expProduct.status);
		product.should.have.property('spec');
		product.spec.publisher.should.equal(expProduct.details.publisher.name);
		product.spec.authors.should.equal(expProduct.details.authors[0].name);
	});

	it('should get one product base on page_url', async () => {
		let expProduct = await Product.findOne({code: '1006'})
			.populate('details.publisher details.authors');

		const res = await server.post('/products')
			.set('accept', 'application/json')
			.send({page_url: expProduct.webURL})
			.expect(200)
			.expect('content-type', 'application/json; charset=utf-8');

		const product = res.body;
		product.page_unique.should.equal(expProduct.code);
		product.page_url.should.equal(expProduct.webURL);
		product.image_link.should.equal(expProduct.image.thumbURL);
		product.current_price.should.equal(expProduct.price);
		product.should.not.have.property('old_price');
		product.status.should.equal(expProduct.status);
		product.should.have.property('spec');
		product.spec.publisher.should.equal(expProduct.details.publisher.name);
		product.spec.authors.should.equal(expProduct.details.authors[0].name);
		product.spec.pages.should.equal(expProduct.details.pages);
		product.spec.size.should.equal(expProduct.details.size);
		product.spec.cover.should.equal(expProduct.details.cover);
	});

	it('should get all products for empty body', async () => {
		const res = await server.post('/products')
			.set('accept', 'application/json')
			.send({})
			.expect(200)
			.expect('content-type', 'application/json; charset=utf-8');

		const body = res.body;
		body.count.should.equal(7);
		body.max_pages.should.equal(1);
		body.products.length.should.equal(7);
	});

	it('should throw bad Format for wrong page url', async () => {
		const res = await server.post('/products')
			.set('accept', 'application/json')
			.send({page_url: 'https://ketabchi.com/publisher/104/%D8%A7%D9%86%D8%AA%D8%B4%D8%A7%D8%B1%D8%A7%D8%AA-%D8%A7%D9%84%DA%AF%D9%88'})
			.expect(500)
			.expect('content-type', 'application/json; charset=utf-8');
		res.body.error.should.equal('Error: BAD_PAGE_URL_FORMAT');
	});


	it('should throw bad page_unique type for wrong page unique', async () => {
		const res = await server.post('/products')
			.set('accept', 'application/json')
			.send({page_unique: 1})
			.expect(500)
			.expect('content-type', 'application/json; charset=utf-8');
		res.body.error.should.equal('Error: BAD_PAGE_UNIQUE_TYPE');
	});

	it('should throw bad page type for wrong page', async () => {
		const res = await server.post('/products')
			.set('accept', 'application/json')
			.send({page: '1'})
			.expect(500)
			.expect('content-type', 'application/json; charset=utf-8');
		res.body.error.should.equal('Error: BAD_PAGE_TYPE');
	});

	it('should get 404 if page_unique doesnt exists', async () => {
		await server.post('/products')
			.set('accept', 'application/json')
			.send({page_unique: '10022'})
			.expect(404)
			.expect('content-type', 'application/json; charset=utf-8');
	});
});
