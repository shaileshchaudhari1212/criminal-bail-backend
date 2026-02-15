const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const storage = (folder) => multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../../uploads', folder))
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        cb(null, uuidv4() + ext)
    }
})

const uploadCriminal = multer({ storage: storage('criminal_photos') })
const uploadAttendance = multer({ storage: storage('attendance_photos') })

module.exports = { uploadCriminal, uploadAttendance }
