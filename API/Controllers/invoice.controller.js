// import { Invoice } from "../Models/Invoice"
import {v4 as uuidv4} from 'uuid';
import { Sequelize } from 'sequelize'
const models = require("../models/index")
const Invoice = models.invoice
let invoice_routes = {}

invoice_routes.get_standard_message = async (req, res) => {
  try {
    return res.status(200).json({ message: 'Welcome!' })
  } catch (error) {
    return res.status(400).json({})
  }
}
invoice_routes.get_clients = async (req, res) => {
  try {
    const clients = await Invoice.findAll({ attributes: [Sequelize.fn('DISTINCT', Sequelize.col('client_number')), 'client_number']})
    let client_numbers = []
    clients.forEach((client) => client_numbers.push(client.client_number))
    return res.status(200).json({ clients: client_numbers })
  } catch (error) {
    return res.status(400).json({error})
  }
}

invoice_routes.get_invoices_size = async (req, res) => {
  try {
    const invoices = await Invoice.findAll()
    return res.status(200).json({ totalInvoices: invoices.length })
  } catch (error) {
    return res.status(400).json({error})
  }
}

invoice_routes.get_invoices_client_size = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({where: {client_number: req.query.client_number}})
    return res.status(200).json({ totalInvoices: invoices.length })
  } catch (error) {
    return res.status(400).json({error})
  }
}

invoice_routes.get_all_invoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({ offset: isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset), limit: isNaN(parseInt(req.query.limit)) ? 10 : parseInt(req.query.limit) })
    return res.status(200).json({ invoices: invoices })
  } catch (error) {
    console.log({error})
    return res.status(400).json({error})
  }
}

invoice_routes.get_invoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      attributes: [
        'ref_month',
        [Sequelize.fn('sum', Sequelize.col('energy_cost')), 'energy_cost'],
        [Sequelize.fn('sum', Sequelize.col('energy_quantity')), 'energy_quantity'],
        [Sequelize.fn('sum', Sequelize.col('scee_cost')), 'scee_cost'],
        [Sequelize.fn('sum', Sequelize.col('scee_quantity')), 'scee_quantity'],
        [Sequelize.fn('sum', Sequelize.col('energy_comp_cost')), 'energy_comp_cost'],
        [Sequelize.fn('sum', Sequelize.col('energy_comp_quantity')), 'energy_comp_quantity'],
        [Sequelize.fn('sum', Sequelize.col('contribution')), 'contribution'],
      ],
      group: ['ref_month'],
      raw: true
    })

    return res.status(200).json({ invoices: invoices })
  } catch (error) {
    return res.status(400).json({error})
  }
}

invoice_routes.get_invoice_by_client = async (req, res) => {
  try {

    const invoices = await Invoice.findAll({where: {client_number: req.query.client_number}})

    return res.status(200).json({ invoices: invoices })
  } catch (error) {
    return res.status(400).json({error})
  }
}

invoice_routes.get_invoice_by_client_page = async (req, res) => {
  try {

    const invoices = await Invoice.findAll({where: {client_number: req.query.client_number}, offset: isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset), limit: isNaN(parseInt(req.query.limit)) ? 10 : parseInt(req.query.limit) } )
    return res.status(200).json({ invoices: invoices })
  } catch (error) {
    return res.status(400).json({error})
  }
}

invoice_routes.create_invoices = (async (req, res, next) => {
  try {
    if (req.body.invoices) {
      const invoices = (req.body.invoices)
      invoices.forEach((invoice) => invoice.idt_invoice = `'${uuidv4()}'`)
      await Invoice.bulkCreate(invoices, {returning: true})
      return res.status(200).json("Criado com sucesso!")
    }
  } catch (error) {

    return res.status(400).json({error});
  }
});

export {invoice_routes}
