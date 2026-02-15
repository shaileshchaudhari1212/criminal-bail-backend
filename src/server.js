require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')

const officerRoutes = require('./routes/officerRoutes')
const criminalRoutes = require('./routes/criminalRoutes')
const attendanceRoutes = require('./routes/attendanceRoutes')
const mediaRoutes = require('./routes/mediaRoutes')
const alertRoutes = require('./routes/alertRoutes')
const adminRoutes = require('./routes/adminRoutes')
const authRoutes = require('./routes/authRoutes')
const auditRoutes = require('./routes/auditRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')



const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))


// ✅ Serve uploads folder
app.use('/uploads', express.static(
  path.join(__dirname, '../../uploads')
))

// Routes
app.use('/api', officerRoutes)
app.use('/api', criminalRoutes)
app.use('/api', attendanceRoutes)
app.use('/api', mediaRoutes)
app.use('/api', alertRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/auth', authRoutes)
app.use('/api', auditRoutes)
app.use('/api', analyticsRoutes)



app.get('/', (req, res) => {
  res.send('Backend Running')
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
