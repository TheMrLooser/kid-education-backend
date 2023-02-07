
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const  Razorpay  = require('razorpay')

const instance = new Razorpay({ key_id: 'rzp_test_tuHYS0gMqbNjea', key_secret: 'OkT5W4X79msZIgZfsnxMKkl1' })

const Checkout = async(req,res)=>{
    try {
        const {amount} = req.body
        const options = {
          amount: Number(amount * 100),
          currency: "INR", 
          receipt: "receipt_rcptid_11",
        };
    
        instance.orders.create(options, function (err, order) {
          if(err){
            return res.json({error:true,message:err.message})
          }
         return res.status(200).json({ order });
        });
      } catch (err) {
        res.status(401).send(err.message);
      }

}



const PaymentCallBack = async(req,res)=>{
    try {
        const {paymentId,orderId,courseId,amount,userId} = req.body
        await prisma.payment.create({
          data:{
            paymentId,courseId,orderId,amount,userId
          }
        })
        return res.status(200).json({success:true, message:"Payment Successfull"})
    } catch (error) {
        res.status(401).send(err.message);
    }
}


const GetPaymentDetails = async(req,res)=>{
  try {
    const PaymentData = await prisma.payment.findMany({});
    return res.status(200).json({success:true,message:PaymentData})
  } catch (error) {
    res.status(401).send(err.message);
  }
}
module.exports = {Checkout,PaymentCallBack,GetPaymentDetails}