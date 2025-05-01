import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [name, setName] = useState('')
  const [regno, setRegno] = useState('')
  const [cgpa, setCGPA] = useState('0.0')
  const [dept, setDept] = useState('')
  const [students, setStudents] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  const saveStudent = async (event) => {
    event.preventDefault()
    try {
      if (isEditing) {
        // Update existing student
        const response = await axios.put(`http://localhost:8000/updatestudent/${editId}`, {
          name,
          regno,
          cgpa,
          dept
        })
        alert(response.data.message)
        setIsEditing(false)
        setEditId(null)
      } else {
        // Create new student
        const response = await axios.post('http://localhost:8000/savestudent',
          { name, regno, cgpa, dept })
        alert(response.data.message)
      }
      // Clear form fields after save or update
      setName('')
      setRegno('')
      setCGPA('0.0')
      setDept('')
      fetchStudents()
    }
    catch (err) {
      alert(err)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/getstudents');
      setStudents(response.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch students');
    }
  }

  const editStudent = (student) => {
    setIsEditing(true)
    setEditId(student._id)
    setName(student.name)
    setRegno(student.regno)
    setCGPA(student.cgpa)
    setDept(student.dept)
  }

  const deleteStudent = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/deletestudent/${id}`);
      alert(response.data.message);
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert('Failed to delete student');
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditId(null)
    setName('')
    setRegno('')
    setCGPA('0.0')
    setDept('')
  }

  return (
    <div>
      <h1>{isEditing ? 'Update Student Details' : 'Save Student Details'}</h1>
      <form onSubmit={saveStudent}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <br />
          <label>Regno:</label>
          <input type="number" value={regno} onChange={(e) => setRegno(e.target.value)} />
          <br />
          <label>CGPA:</label>
          <input type="number" value={cgpa} onChange={(e) => setCGPA(e.target.value)} />
          <br />
          <label>Dept:</label>
          <input type="text" value={dept} onChange={(e) => setDept(e.target.value)} />
          <br />
          <br />
          <button>{isEditing ? 'Update Student' : 'Save Student'}</button>
          {isEditing && <button type="button" onClick={cancelEdit} style={{ marginLeft: '10px' }}>Cancel</button>}
        </div>
      </form>
      <br />
      <button onClick={fetchStudents}>View</button>

      <h1>All STUDENTS</h1>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Regno</th>
            <th>CGPA</th>
            <th>Dept</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td className="border border-gray-400 px-4 py-2">{student.name}</td>
              <td className="border border-gray-400 px-4 py-2">{student.regno}</td>
              <td className="border border-gray-400 px-4 py-2">{student.cgpa}</td>
              <td className="border border-gray-400 px-4 py-2">{student.dept}</td>
              <td className="border border-gray-400 px-4 py-2">
                <button onClick={() => editStudent(student)}>Edit</button>
                <button onClick={() => deleteStudent(student._id)} style={{ marginLeft: '10px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
