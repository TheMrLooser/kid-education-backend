const express = require('express')
const { GetAllContactRequests, DeleteRequests, UpdateRequestsStatus, GetSingleContactRequests } = require('../Mail/mailControlterDB')
const {SendDefaultMail} = require('../Mail/SendMail')

const mailRouter = express.Router()


mailRouter.post('/send-default-mail',SendDefaultMail)
mailRouter.get('/get-all-requests',GetAllContactRequests)
mailRouter.get('/get-single-requests',GetSingleContactRequests)
mailRouter.delete('/delete-request',DeleteRequests)
mailRouter.put('/change-status-request',UpdateRequestsStatus)

module.exports = mailRouter

