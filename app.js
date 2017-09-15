'use strict';

const Hapi = require('hapi');
const Good = require('good');

const server = new Hapi.Server();
require('dotenv').load();

const env = process.env;

server.connection({
	port: env.APP_PORT,
	host: env.APP_HOST,
});

server.route({
	method: 'GET',
	path: '/',
	handler: function(request, reply) {
		reply('Hello, world');
	}
});

server.route({
	method: 'GET',
	path: '/hello',
	handler: (request, reply) => {
		reply.file('./views/hello.html');
	}
});

server.register([{
	register: Good,
	options: {
		reporters: {
			console: [{
				module: 'good-squeeze',
				name: 'Squeeze',
				args: [{
					response: '*',
					logs: '*'
				}]
			}, {
				module: 'good-console'
			}, 'stdout']
		}
	}
}, {
	register: require('inert'),
	options: {}
}], err => {
	if(err) {
		throw err;
	}
});

server.start( err => {
	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);
});
