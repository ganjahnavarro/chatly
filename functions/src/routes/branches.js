import express from 'express'
import api from '../api'

const { addBranch, updateBranch, deleteBranch, getBranches, getBranch } = api
const branches = express.Router()

const findAll = (req, res) => {
    getBranches().then(branches => {
        res.status(200).json(branches)
    })
}

const find = (req, res) => {
    getBranch(req.params.id).then(branch => {
        res.status(200).json(branch)
    })
}

const add = (req, res) => {
    addBranch(req.body)
    res.status(200).json({ success: true })
}

const update = (req, res) => {
    updateBranch(req.params.id, req.body)
    res.status(200).json({ success: true })
}

const remove = (req, res) => {
    deleteBranch(req.params.id)
    res.status(200).json({ success: true })
}

branches.get('/', findAll)
branches.get('/:id', find)

branches.post('/', add)
branches.put('/:id', update)
branches.delete('/:id', remove)

module.exports = branches
