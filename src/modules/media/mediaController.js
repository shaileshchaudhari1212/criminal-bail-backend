exports.uploadCriminalPhoto = (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      error: 'No file uploaded'
    })
  }

  res.json({
    path: `/uploads/criminal_photos/${req.file.filename}`
  })
}

exports.uploadAttendancePhoto = (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      error: 'No file uploaded'
    })
  }

  res.json({
    path: `/uploads/attendance_photos/${req.file.filename}`
  })
}
