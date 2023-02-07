const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')


exports.isAuthenticated =  async (req,res,next)=>{
    try {
        const  {access_token} = req.cookies; 
    
        if(!access_token){
            return next(  res.status(401).json('Please Login First'))
        }
        const decodedData = jwt.verify(access_token,process.env.SECRET_KEY);
        req.user = await prisma.user.findUnique({where:{email:decodedData.id}}) 

        next() 
    } catch (error) {
        return res.status(401).send(error)
    }
}


exports.autherizedRole =  (...Roles)=>{
    try {
        return (req,res,next)=>{
            if(!Roles.includes(req.user.role)){  
                return next(
                 res.status(403).json(`Only   Admin Can Access This API `)
                )
            }
            next()
        }
    } catch (error) {
        return res.status(401).send(error)
    }
}


exports.buyedThisCourse = async(req,res,next)=>{
try {
    const courseId = req.params.courseId
    const buyedCoursesList = req.user.course
    const buyed = buyedCoursesList.includes(courseId)
    if(!buyed){
        return res.status(401).json('Buy This Course')
    }
    next()
} catch (error) {
    return res.status(401).send(error)
}
}