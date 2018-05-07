import express from 'express'
import api from '../api'

const { addCategory, updateCategory, deleteCategory, getCategories, getCategory } = api
const categories = express.Router()

const findAll = (req, res) => {
    getCategories().then(categories => {
        res.status(200).json(categories)
    })
}

const find = (req, res) => {
    getCategory(req.params.id).then(category => {
        res.status(200).json(category)
    })
}

const add = (req, res) => {
    addCategory(req.body)
    res.status(200).json({ success: true })
}

const update = (req, res) => {
    updateCategory(req.params.id, req.body)
    res.status(200).json({ success: true })
}

const remove = (req, res) => {
    deleteCategory(req.params.id)
    res.status(200).json({ success: true })
}

categories.get('/', findAll)
categories.get('/:id', find)

categories.post('/', add)
categories.put('/:id', update)
categories.delete('/:id', remove)

module.exports = categories
