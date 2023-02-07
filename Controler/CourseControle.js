const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const CreateCourse = async (req, res) => {
    try {
        const { price, img, tags, subName, ...rest } = req.body
        const parseIntPrice = parseInt(price)
        const parseInStringImg = img.toString()

        const tag = tags?.split(',');
        await prisma.course.create({
            data: {
                price: parseIntPrice, img: Buffer.from(parseInStringImg, 'utf8'), subName, tags: tag, ...rest
            }
        })

        return res.status(200).json({ error: false, message: 'New Course Added Succesfull' })
    } catch (error) {
        return res.status(401).json({ error: true, message: `internal error : ${error}` })
    }
}

const GetAllCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany({

            orderBy: [{ rating: 'desc' }],
            include: { video: true }

        })
        for (let i = 0; courses.length > i; i++) {
            courses[i].img = courses[i].img.toString('utf8')
        }
        return res.status(200).json({ courses })
    } catch (error) {
        return res.status(401).json({ error })
    }
}


const GetAllCatagories = async (req, res) => {
    try {
        const courses = await prisma.course.groupBy({
            by:['catagory'],
            where:{
                catagory:{
                    notIn:['',' ','null']
                }
            }

        })
         
        return res.status(200).json({ courses })
    } catch (error) {
        return res.status(401).json({ error })
    }
}


const GetPopularCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            orderBy: [{ rating: 'desc' }],
            include: { video: true }

        })
        for (let i = 0; courses.length > i; i++) {
            courses[i].img = courses[i].img.toString('utf8')
        }
        return res.status(200).json({ courses })
    } catch (error) {
        return res.status(401).json({ error })
    }
}


const GetCatagariseCourses = async (req, res) => {
    try {
        const catagory = req.params.catagory
        const courses = await prisma.course.findMany({
            orderBy: [{ rating: 'desc' }],
            include: { video: true },
            where: { catagory: { contains: catagory, mode: 'insensitive' } }

        })
        for (let i = 0; courses.length > i; i++) {
            courses[i].img = courses[i].img.toString('utf8')
        }
        return res.status(200).json({ courses })
    } catch (error) {
        return res.status(401).json({ error })
    }
}
const GetSingleCourse = async (req, res) => {
    try {
        const id = req.params.courseId
        const course = await prisma.course.findUnique({ where: { id }, include: { video: true } })
        if (!course) {
            return res.status(200).json({ error: true, message: 'Course Not Found' })
        }
        course.img = course.img.toString('utf8')
        return res.status(200).json({ error: false, course })
    } catch (error) {
        return res.status(401).json({ error })
    }
}

const UpdateCourse = async (req, res) => {

    try {
        const todaysDate = new Date(Date.now())
        const { courseId, subTitle,courseName, price, description, img, rating, auther, tags, catagory } = req.body
        const course = await prisma.course.findUnique({ where: { id: courseId } })
        const parseInStringImg = img && img.toString()
        if (!course) {
            return res.status(404).json({ error: true, message: 'Course Not Found' })
        }
        const newRating = rating ? course.rating + rating : course.rating
        const noOfRating = rating ? course.noOfRating + 1 : course.noOfRating
        if (rating) {
            await prisma.course.update({ where: { id: courseId }, data: { rating: newRating, noOfRating: noOfRating } })
            return res.status(200).json({ error: false, message: 'Course Updated' })
        }
        if (tags) {
            const tagsArray = tags.split(",")
            for (const iterator of tagsArray) {
                await prisma.course.update({ where: { id: courseId }, data: { tags: { push: iterator } } })
            }
        }
        await prisma.course.update({
            where: { id: courseId },
            data: {
                courseName, price: parseInt(price), description, img: Buffer.from(parseInStringImg, 'utf8'),subTitle, rating: newRating, auther, updatedAt: todaysDate, noOfRating, catagory
            }
        })

        return res.status(200).json({ error: false, message: 'Course Updated' })

    } catch (error) {
        return res.status(401).json({ error })

    }
}

const DeleteCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId
        const course = await prisma.course.findUnique({ where: { id: courseId } })
        if (!course) {
            return res.status(200).json({ error: true, message: 'Course Not Found' })
        }
        await prisma.course.delete({ where: { id: courseId } })
        return res.status(200).json({ error: false, message: 'Course Deleted Successfully' })

    } catch (error) {
        return res.status(401).json({ error })
    }
}

const SearchCourses = async (req, res) => {
    try {
        const { query,price,category } = req.query
        const isPrice = parseInt(price)?parseInt(price):0
        const course = await prisma.course.findMany({
            where:
            {
                AND: [
                    {
                        OR:[
                            {
                                tags: {
                                    has: query?query:'none'
                                }
                            },
                            {
                                courseName: {
                                    contains: query, mode: 'insensitive'
                                }
                            },
                        ]
                    },
                      
                    {
                        OR:[
                            {
                                price: { lte: isPrice, gte: 0 }
                            },
                            {
                                catagory:{equals:category, mode:'insensitive'}
                            }
                        ]
                    }
                        
                ]
                
            }
            , orderBy: [{
                rating: 'desc'
            }]
        })
        for (let i = 0; course.length > i; i++) {
            course[i].img = course[i].img.toString('utf8')
        }
        return res.status(200).json(course)
    } catch (error) {
        return res.status(401).json({ error })
    }
}
 


const RelatedCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId
        const Findcourse = await prisma.course.findUnique({ where: { id: courseId } })
        if (!Findcourse) { return res.status(202).json({ error: true, message: 'No tags in user' }) }
        const tag = Findcourse.tags
        const courses = await prisma.course.findMany({ where: { tags: { hasSome: Findcourse.tags } } })
        for (let i = 0; courses.length > i; i++) {
            courses[i].img = courses[i].img.toString('utf8')
        }
        return res.status(200).json({ courses })

    } catch (error) {
        return res.status(401).json({ error })
    }
}
const AdminRelatedCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId
        const Findcourse = await prisma.course.findUnique({ where: { id: courseId } })

        if (!Findcourse) { return res.status(202).json({ error: true, message: 'No course' }) }
        const courses = await prisma.course.findMany({ where: { auther: { contains: Findcourse.auther, mode: 'insensitive' } } })
        for (let i = 0; courses.length > i; i++) {
            courses[i].img = courses[i].img.toString('utf8')
        }
        return res.status(200).json({ error: false, courses })

    } catch (error) {
        return res.status(401).json({ error })
    }
}

 


module.exports = {GetAllCatagories, AdminRelatedCourse, CreateCourse, GetAllCourses, GetSingleCourse, UpdateCourse, DeleteCourse, SearchCourses, RelatedCourse, GetCatagariseCourses, GetPopularCourses }