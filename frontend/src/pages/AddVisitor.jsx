import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function AddVisitor() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    gender: "",
    age: "",
    designation: "",
    mobile_no: "",
    email: "",
    address: "",
  })

  const [profileImage, setProfileImage] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null
    setProfileImage(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const formData = new FormData()

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key])
      })

      if (profileImage) {
        formData.append("profile_image", profileImage)
      }

      await api.post("/register/visitor", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      alert("Visitor added successfully")
      navigate("/visitors")
    } catch (error) {
      console.error("Failed to add visitor:", error)
      alert("Failed to add visitor")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white p-8 rounded-lg shadow w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Add New Visitor
        </h2>

        <input type="file" name="profile_image" accept="image/*" onChange={handleFileChange} required className="mb-4"/>

        <input name="name" placeholder="Name" onChange={handleChange} required className="input"/>
        <input name="gender" placeholder="Gender" onChange={handleChange} required className="input mt-3"/>
        <input name="age" type="number" placeholder="Age" onChange={handleChange} required className="input mt-3"/>
        <input name="designation" placeholder="Designation" onChange={handleChange} required className="input mt-3"/>
        <input name="mobile_no" placeholder="Mobile Number" onChange={handleChange} required className="input mt-3"/>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="input mt-3"/>
        <input name="address" placeholder="Address" onChange={handleChange} required className="input mt-3"/>

        <button type="submit" className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold">
          Save Visitor
        </button>
      </form>
    </div>
  )
}