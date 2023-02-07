const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


const AddToCart = async (req,res)=>{
    try {
        const {courseId,img,...rest} = req.body
        const course = await prisma.cart.findUnique({where:{courseId}})
        const parseInStringImg = img.toString()
        if(!course){
            const x  = await prisma.cart.create({
                data:{
                    img:Buffer.from(parseInStringImg,'utf8'),courseId, ...rest
                }
            })
            return res.status(200).json({success:true,message:'Course Added in your Cart'})
        }
        return res.status(200).json({success:true,message:'Course Allreay Added in your Cart'})

    } catch (error) {
        console.log(error)
        return res.status(500).json({error})
    }
}

const RemoveFromCart = async(req,res)=>{
    try {
        const courseId = req.params.courseId
        const course = await prisma.cart.findUnique({where:{courseId}})
        if(!course){
            return res.status(200).json({success:true,message:'Course Not in your Cart'})
        }
        await prisma.cart.delete({where:{courseId}})
        return res.status(200).json({success:true,message:'Course Removed from your Cart'})
    } catch (error) {
        return res.status(500).json({error})
    }
}

const GetAllCartCourses = async(req,res)=>{
    try {
         
        const courses  = await prisma.cart.findMany({})
        for(let i=0; courses.length>i;i++){
            courses[i].img = courses[i].img.toString('utf8')
        }
        return res.status(200).json({courses})
    } catch (error) {
        return res.status(401).json({error})
    }
}

module.exports = {AddToCart,RemoveFromCart,GetAllCartCourses}