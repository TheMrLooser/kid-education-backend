const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


const AddVideo = async(req,res)=>{
    try {
        await prisma.video.create({data:{...req.body}})
        return res.status(200).json({success:true,message:'Video Uploaded'})
    } catch (error) {
        return res.status(401).json({error})
    }
}

const GetAllVideos = async(req,res)=>{
    try {
       const videos =  await prisma.video.findMany({})
        return res.status(200).json({success:true,videos})
    } catch (error) {
        return res.status(401).json({error})
    }
}

const UpdateVideo = async(req,res)=>{
    try {
        const {videoId,title,description} = req.body
        await prisma.video.update({where:{id:videoId}, data:{title,description}})
        return res.status(200).json({success:true,message:'Video Updated'})
    } catch (error) {
        return res.status(401).json({error})
    }
}

const DeleteVideo = async(req,res)=>{
    try {
        const videoId = req.params.videoId
        await prisma.video.delete({where:{id:videoId}})
        return res.status(200).json({success:true,message:'Video Deleted'})
    } catch (error) {
        return res.status(401).json({error})
    }
}

module.exports = {DeleteVideo,AddVideo,UpdateVideo,GetAllVideos}