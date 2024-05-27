const expect = require('chai').expect
let chai = require('chai')
let chaiHttp = require('chai-http')
const axios = require('axios')
const models = require("../models/index")
const Invoice = models.invoice
chai.use(chaiHttp)

describe('Routes\' tests', function () {
  let base_url = 'http://localhost:5001'
  let invoice =
    [{
      'client_number': '123',
      'ref_month': 'JAN/2023',
      'energy_cost': 123,
      'energy_quantity': 312,
      'scee_cost': 123,
      'scee_quantity': 123,
      'energy_comp_cost': 123,
      'energy_comp_quantity': 123,
      'contribution': 123,
      'b64_file': 'stringb64',
    }]

  let wrong_invoice = [{
    'client_number': null,
    'ref_month': 'JAN/2023',
    'energy_cost': 123,
    'energy_quantity': 312,
    'scee_cost': 123,
    'scee_quantity': 123,
    'energy_comp_cost': 123,
    'energy_comp_quantity': 123,
    'contribution': 123,
    'b64_file': 'stringb64',
  }]

  let clientNumber = "7005400387"

  it('should return the welcome msg',   (done) => {
    chai.request(base_url).get('/').end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200)
      done();
    })

  })

  it('should return all the clients',   (done) => {
    chai.request(base_url).get('/invoice/clients').end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200)
      done();
    })

  })

  it('should return all the invoices',   (done) => {
    chai.request(base_url).get('/invoices').end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200)
      done();
    })

  })

  it('should return the number of invoices',   (done) => {
    chai.request(base_url).get('/invoices/size').end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200)
      done();
    })

  })

  it('should return the number of invoices for the specified client',   (done) => {
    chai.request(base_url).get('/invoices/client/size?client_number=' + clientNumber).end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200)
      done();
    })
  })

  it('should return the sum of invoices values grouped by months',   (done) => {
    chai.request(base_url).get('/invoice/all').end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200)
      done();
    })

  })

  it('should return all the invoices for the specified client',   (done) => {
    chai.request(base_url).get('/invoice/client?client_number=' + clientNumber).end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200)
      done();
    })
  })

  it('should return the page of invoices for the specified client',   (done) => {
    chai.request(base_url).get('/invoice/client/page?client_number=' + clientNumber).end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200)
      done();
    })
  })

  it('should add an invoice to the db',   (done) => {
    chai.request(base_url).post('/invoice/create').send({ invoices: invoice }).end(async (err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200)
      await Invoice.destroy({where: {client_number: '123'}})
      done();
    })
  })

  it('should not add an invoice to the db',  (done) => {
    chai.request(base_url).post('/invoice/create').send({ invoices: wrong_invoice }).end((err, res) => {
      expect(res).to.have.status(400)
      done();
    })
  })

})

