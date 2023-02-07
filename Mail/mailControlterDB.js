const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const GetAllContactRequests = async (req,res)=>{
    try {
        const {UnResolved,Resolved} = req.query
        if(UnResolved==="true" || Resolved==="true"){
            const contactRequests = UnResolved? await prisma.contact.findMany({where:{status:"UnResolved"}}):await prisma.contact.findMany({where:{status:"Resolved"}})
            return res.status(200).json({success:true,message:contactRequests})
        }
        const contactRequests = await prisma.contact.findMany({})
        return res.status(200).json({success:true,message:contactRequests})
    } catch (error) {
        return res.status(500).json({error:true,message:error})
    }
}
 
const GetSingleContactRequests = async (req,res)=>{
    try {
        const {id} = req.query
        if(!id){
            return res.status(404).json({error:true,message:"Provide Request ID"})
        }
        const contactRequest = await prisma.contact.findUnique({where:{id}})
        if(!contactRequest){
            return res.status(404).json({error:true,message:"Provide Currect Request ID"})
        }
        return res.status(200).json({success:true,message:contactRequest})
    } catch (error) {
        return res.status(500).json({error:true,message:error})
    }
}

const DeleteRequests = async(req,res)=>{
    try {
        const {id} = req.query
        if(!id){
            return res.status(404).json({error:true,message:"Provide Request ID"})
        }
        await prisma.contact.delete({where:{id}})
        return res.status(200).json({success:true,message:"Request is Deleted"})
    } catch (error) {
        return res.status(500).json({error:true,message:error})
    }
}

const UpdateRequestsStatus = async(req,res)=>{
    try {
        const {id} = req.query
        if(!id){
            return res.status(404).json({error:true,message:"Provide Request ID"})
        }
        await prisma.contact.update({
            where:{id},
            data:{status:"Resolved"}
        })
        return res.status(200).json({success:true,message:"Status Changed"})
    } catch (error) {
        return res.status(500).json({error:true,message:error})
    }
}

module.exports = {GetSingleContactRequests,UpdateRequestsStatus,DeleteRequests,GetAllContactRequests}