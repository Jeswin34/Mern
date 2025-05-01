const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const studentModel = require('./Students')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/College')

    .then(() => console.log('DB connected'))
    .catch(err => console.log(err))

app.post('/savestudent', async (req, res) => {
    try {
        console.log(req.body)
        await studentModel.create(req.body)
        res.json({ message: 'Student  Added Successfully' })
    }
    catch (error) {
        res.json(error)
    }
})

app.get('/getstudents', async (req, res) => {
    try {
        const students = await studentModel.find()
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

app.put('/updatestudent/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedStudent = await studentModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student updated successfully', student: updatedStudent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/deletestudent/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStudent = await studentModel.findByIdAndDelete(id);
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 8000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
