const express = require('express')
const { AddVideo, DeleteVideo, UpdateVideo, GetAllVideos } = require('../Controler/VideoControle')
const { isAuthenticated, autherizedRole } = require('../middleware/auth')

const videoRouter = express.Router()

videoRouter.post('/add-video', AddVideo)
videoRouter.delete('/delete-video' ,DeleteVideo)
videoRouter.put('/update-video',UpdateVideo)
videoRouter.get('/get-all-video',GetAllVideos)

module.exports = videoRouter