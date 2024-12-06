const { ServiceBroker } = require('moleculer');
const config = require('./moleculer.config');

const broker = new ServiceBroker(config);

broker.loadServices('services', '**/*.service.js')
broker.start().then(() => console.log('API Service started'))
.catch(err => console.error('Failed to start API Service:', err));