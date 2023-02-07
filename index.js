const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./Router/userRouter');
const courseRouter = require('./Router/courseRouter');
const cors = require('cors')
const cookieParser = require("cookie-parser");
const helmet = require('helmet');
const videoRouter = require('./Router/videoRoute');
const paymentRouter = require('./Router/paymentRouter');
const cartRouter = require('./Router/cartRouter');
const myCourseRouter = require('./Router/myCourseRouter');
const mailRouter = require('./Router/mailRouter');
dotenv.config({path:".env"})

const app  = express()

app.use(express.json())
app.use(cookieParser());
// app.use(express.urlencoded({extended:true}))
app.use(helmet())
app.use(cors({
    origin:['http://localhost:3000','http://kid-project.surge.sh','http://192.168.0.102:3000'],
    methods: ['GET', 'PUT', 'POST','DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'], 
    credentials: true, 
    maxAge: 600, 
    exposedHeaders: ['*', 'Authorization' ] 
})) 



app.use('/user',userRouter)
app.use('/course',courseRouter)
app.use('/video',videoRouter)
app.use('/payment',paymentRouter)
app.use('/cart',cartRouter)
app.use('/mycourse',myCourseRouter)
app.use('/mail',mailRouter)



const array = [1,4,2,3,3,2,4,1];
const num = 20;
let ans = 1
for(let i =0; i<num; i++){
    console.log(ans)
    ans += array[i%8]
}


app.listen(process.env.PORT,(req,res)=>{
    console.log(`Server is running at ${process.env.PORT}`)
})