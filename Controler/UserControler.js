const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

 const RegisterUser = async(req,res , next)=>{
    try { 
        
        const {email,password,name,phone} = req.body
        const user = await prisma.user.findUnique({where:{email:email}})
        const hashedPassword = await bcrypt.hash(password,10)
        if(!user){
            const token = jwt.sign({id:email},process.env.SECRET_KEY)
            res.cookie("access_token",token/*,{secure: true,sameSite: 'none',httpOnly:true}*/).status(200)
           const x = await prisma.user.create({ 
                data:{
                    name:name,phone:phone,
                    email:email, 
                    password:hashedPassword, 
                } 
            }) 
            return res.status(200).json({success:true,message:"successfuly registered"})

        }else{
        return res.status(200).json({error:true,message:"User Allready exist"})

        }
        
    }  catch (error) {
       return res.status(500).json({error:true,message:`Some Internal Error \n ${error}`})
    }
}


const LoginUser =async(req,res,next)=>{
    try {
        const {email,password} = req.body;
        const user = await prisma.user.findUnique({where:{email},include:{cart:true,myMourse:true}})
        
        if(!user){
                return res.status(200).json({error:true,message:"Wrong Email Id"})
        } 
        const compairePassword = await bcrypt.compare(password,user.password)
            
        if(!compairePassword){
            return res.status(200).json({error:true,message:"Wrong Password"})
        }
        {const {password,...other} = user
        return res.status(200).json({success:true,token:user.id, message:other})}
        
          
    } catch (error) {
        return res.status(401).json({error:true,message:`Some Internal Error \n ${error}`})
    }
}



const LogOut = (req,res,next)=>{
    res.cookie("access_token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
        secure: true,
        sameSite: 'none'
    })
   return res.status(200).send("Loged out ")
}

const GetAllUsers = async(req,res,next)=>{ 
    try {
        const users = await prisma.user.findMany({include:{cart:true}})
        return res.status(200).json({users})

    } catch (error) {
        return res.status(401).json({error})
    }
}

const GetSingleUser = async(req,res,next)=>{
    try {
        const userId = req.params.userId
        const user = await prisma.user.findUnique({where:{id:userId},include:{cart:true}})
        if(user){
            return res.status(200).json({user})
        }
        return res.status(404).json({error:true,message:"User Not Found"})
    } catch (error) {
        return res.status(401).json({error})
    }
}




const UpdateUser = async(req,res,next)=>{
    try {
        const {userId,name,email,password,phone,course,role,tags} = req.body
        const user = await prisma.user.findUnique({where:{id:userId}})
        if(!user){
            return res.status(404).json({error:true,message:"User Not Found"})
        }
        
       else if(password){
            const newPassword =  await bcrypt.hash(password,10)
            await prisma.user.update({
                where:{id:userId},
                data:{
                    password:newPassword
                }
            })
            return res.status(200).json({success:true,message:'Password Updated'})
            
        }
        
       else if(tags){
            const tagsArray = tags.split(" ")
            for (const iterator of tagsArray) {
                await prisma.user.update({where:{id:userId},data:{tags:{push:iterator}}})
            }
        }
        await prisma.user.update({
            where:{id:userId},
            data:{
                    name,email,phone,role
            }
        })
        return res.status(200).json({success:true,message:'User Updated'})
         
    } catch (error) {
        console.log(error)
        return res.status(401).json({error})
    }
}

const DeleteUser = async(req,res,next)=>{
    try {
        const userId = req.params.userId
        const user = await prisma.user.findUnique({where:{id:userId}})
        if(!user){
        return res.status(404).json({success:true,message:'User Not Found'})
        }
        await prisma.user.delete({where:{id:userId}})
        return res.status(200).json({success:true,message:'User Deleted Successfully'})
    } catch (error) {
        return res.status(401).json({error})
    }
}

 



module.exports = {RegisterUser, LoginUser,UpdateUser,GetAllUsers,GetSingleUser,DeleteUser,LogOut}