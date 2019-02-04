const CustomerRepository = require('./customer-repository');
const ContractRepository = require('./contract-repository');
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const customerRepository = new CustomerRepository();
const contractRepository = new ContractRepository();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

app.get('/customers', function (request, response) {
    setTimeout(() => {
        response.json(customerRepository.findAll());
    }, 1000);
});

app.get('/customers/:id', function (request, response) {
    const customerId = request.params.id;
    setTimeout(() => {
        try {
            response.json(customerRepository.find(customerId));
        } catch (exeception) {
            response.sendStatus(404);
        }
    }, 1000);
});

app.post('/customers', function (request, response) {
    const customer = request.body;
    if (!customer.name || !customer.age || !customer.type) {
        response.status(400).end();
        return;
    }
    const newCustomer = {
        name: customer.name,
        age: customer.age,
        type: customer.type,
        photoUrl: customer.photoUrl || `http://localhost:${config.port}/images/customer.png`,
        description: customer.description || '',
        address: {
            street: (customer.address || {}).street || '',
            houseNumber: (customer.address || {}).houseNumber || 0,
            city: (customer.address || {}).city || ''
        },
        categories: customer.categories || []
    };
    customerRepository.save(newCustomer);
    response.json(newCustomer).status(200).end();
});

app.delete('/customers/:id', function (request, response) {
    try {
        const id = parseInt(request.params.id);
        const customer = customerRepository.find(id);
        customerRepository.remove(id);
        response.json(customer).status(200).end();
    } catch (exeception) {
        response.sendStatus(404);
    }
});

app.get('/contracts', function (request, response) {
    setTimeout(() => {
        response.json(contractRepository.findAll());
    }, 1000);
});

app.get('/contracts/:id', function (request, response) {
    const contractId = request.params.id;
    setTimeout(() => {
        try {
            response.json(contractRepository.find(contractId));
        } catch (exeception) {
            response.sendStatus(404);
        }
    }, 1000);
});

app.listen(config.port);