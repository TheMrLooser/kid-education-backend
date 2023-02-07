const express = require('express')
const {RegisterUser,LoginUser, GetAllUsers, GetSingleUser, UpdateUser, DeleteUser, LogOut}  = require('../Controler/UserControler')
const { isAuthenticated, autherizedRole } = require('../middleware/auth')

const userRouter = express.Router()

userRouter.post('/register',RegisterUser) 
userRouter.post('/login',LoginUser)
userRouter.get('/get-all-user',/*isAuthenticated, autherizedRole("Admin"),*/ GetAllUsers)
userRouter.get('/get-single-user/:userId',GetSingleUser)
userRouter.put('/update-user',/*isAuthenticated,*/UpdateUser) 
userRouter.delete('/delete-user/:userId',DeleteUser)
userRouter.get('/logout',LogOut)
 

module.exports = userRouter