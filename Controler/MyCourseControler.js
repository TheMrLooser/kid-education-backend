const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


const BuyNewCourse = async (req,res)=>{
    try {
        const {courseId,img,...rest} = req.body
        const course = await prisma.myCourse.findUnique({where:{courseId}})
        const parseInStringImg = img.toString()
        if(!course){
            await prisma.myCourse.create({
                data:{
                    img:Buffer.from(parseInStringImg,'utf8'),courseId, ...rest
                }
            })
            return res.status(200).json({success:true,message:'New Course Buyed Successfully'})
        }
        return res.status(200).json({success:true,message:'Course Allreay Buyed'})

    } catch (error) {
        console.log(error)
        return res.status(500).json({error})
    }
}

const RemoveFromMyCourse = async(req,res)=>{
    try {
        const courseId = req.params.courseId
        const course = await prisma.myCourse.findUnique({where:{courseId}})
        if(!course){
            return res.status(200).json({success:true,message:'Course Not in your Buyed List'})
        }
        await prisma.myCourse.delete({where:{courseId}})
        return res.status(200).json({success:true,message:'Course Removed from your Buyed List'})
    } catch (error) {
        return res.status(500).json({error})
    }
}

const GetAllBuyedCourse = async(req,res)=>{
    try {
         
        const courses  = await prisma.myCourse.findMany({})
        for(let i=0; courses.length>i;i++){
            courses[i].img = courses[i].img.toString('utf8')
        }
        return res.status(200).json({courses})
    } catch (error) {
        return res.status(401).json({error})
    }
}

module.exports = {GetAllBuyedCourse,RemoveFromMyCourse,BuyNewCourse}