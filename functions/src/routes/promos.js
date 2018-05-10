import express from 'express'
import api from '../api'

const { addPromo, updatePromo, deletePromo, getPromos, getPromo } = api
const promos = express.Router()

const findAll = (req, res) => {
    getPromos().then(promos => {
        res.status(200).json(promos)
    })
}

const find = (req, res) => {
    getPromo(req.params.id).then(promo => {
        res.status(200).json(promo)
    })
}

const add = (req, res) => {
    addPromo(req.body)
    res.status(200).json({ success: true })
}

const update = (req, res) => {
    updatePromo(req.params.id, req.body)
    res.status(200).json({ success: true })
}

const remove = (req, res) => {
    deletePromo(req.params.id)
    res.status(200).json({ success: true })
}

promos.get('/', findAll)
promos.get('/:id', find)

promos.post('/', add)
promos.put('/:id', update)
promos.delete('/:id', remove)

module.exports = promos
