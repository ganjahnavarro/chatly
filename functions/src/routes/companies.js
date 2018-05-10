import express from 'express'
import api from '../api'

const { addCompany, updateCompany, deleteCompany, getCompanies, getCompany } = api
const companies = express.Router()

const findAll = (req, res) => {
    getCompanies().then(companies => {
        res.status(200).json(companies)
    })
}

const find = (req, res) => {
    getCompany(req.params.id).then(company => {
        res.status(200).json(company)
    })
}

const add = (req, res) => {
    addCompany(req.body)
    res.status(200).json({ success: true })
}

const update = (req, res) => {
    updateCompany(req.params.id, req.body)
    res.status(200).json({ success: true })
}

const remove = (req, res) => {
    deleteCompany(req.params.id)
    res.status(200).json({ success: true })
}

companies.get('/', findAll)
companies.get('/:id', find)

companies.post('/', add)
companies.put('/:id', update)
companies.delete('/:id', remove)

module.exports = companies
