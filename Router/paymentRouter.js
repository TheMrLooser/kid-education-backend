const express = require('express')
const {Checkout,PaymentCallBack, GetPaymentDetails} = require('../Controler/PaymentControle')

const paymentRouter  = express.Router()

paymentRouter.post('/checkout',Checkout) 
paymentRouter.post('/payment-call-back',PaymentCallBack) 
paymentRouter.get('/get-all-payments',GetPaymentDetails) 

module.exports = paymentRouter