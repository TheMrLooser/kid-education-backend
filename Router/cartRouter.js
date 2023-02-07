const express = require('express');
const { AddToCart, RemoveFromCart, GetAllCartCourses } = require('../Controler/CartControler');

const cartRouter = express.Router()

cartRouter.post('/add-to-cart',AddToCart)
cartRouter.delete('/remove-from-cart/:courseId',RemoveFromCart)
cartRouter.get('/get-all-cart-courses',GetAllCartCourses) 

module.exports = cartRouter