import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";



export default function EditEmployee() {
  const { id } = useParams()
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    age: "",
    designation: "",
    mobile_no: "",
    email: "",
    address: "",
  })
  useEffect(() => {
    api
      .get(`/get/employees/details/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setForm(res.data))
      .catch((err) => console.error(err))
  }, [id])
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  };

  const handleUpdate = async (e) => {
    e.preventDefault()

    try {
      await api.patch(
        `/update/employees/details/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      )

      alert("Employee updated successfully")
      navigate("/employees");
    } catch (err) {
      console.error(err)
        alert("Update failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <form onSubmit={handleUpdate} className="bg-white p-8 rounded-lg shadow w-full max-w-lg" >
   <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">  Edit Employee </h2>
 <input name="name" value={form.name} onChange={handleChange} className="input" />
        <input name="gender" value={form.gender} onChange={handleChange} className="input mt-3" />
        <input name="age" value={form.age} onChange={handleChange} className="input mt-3" />
        <input name="designation" value={form.designation} onChange={handleChange} className="input mt-3" />
        <input name="mobile_no" value={form.mobile_no} onChange={handleChange} className="input mt-3" />
        <input name="email" value={form.email} onChange={handleChange} className="input mt-3" />
        <input name="address" value={form.address} onChange={handleChange} className="input mt-3" />

        <button  type="submit"  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"  >
          Update Employee
        </button>
      </form>
    </div>
  )
}
