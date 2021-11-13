const glob = require( 'glob' );
const path = require( 'path' );

let routes = [];
let options = {cache: true, ignore: './app/routes/index.js'};
glob.sync('./app/routes/*.js', options).forEach(file => {
	routes.push(require(path.resolve(file)));
});

module.exports = routes;
