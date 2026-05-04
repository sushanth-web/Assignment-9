import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { QRCodeCanvas } from 'qrcode.react';

export default function PrintVisitor() {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    gender: "",
    age: "",
    designation: "",
    mobile_no: "",
    email: "",
    address: "",
    profile_image: "",
    visitor_id: "",
  });

  // Load visitor data
  useEffect(() => {
    api
      .get(`/get/visitors/details/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setForm(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <section className="bg-white p-8 rounded-lg shadow w-full max-w-lg relative">
        
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Print Visitor
        </h2>

        {/* Visitor Image top-left */}
        {form.profile_image && (
          <img
            src={form.profile_image}
            alt={form.name}
            className="w-20 h-20 rounded-full object-cover absolute top-6 left-6 border-2 border-indigo-600"
          />
        )}
        {/* QR Code top-right */}
        <div className="absolute top-6 right-6">
          <QRCodeCanvas 
            value={form.visitor_id || id} 
            size={80} 
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
          />
        </div>

        {/* Visitor Details */}
        <div className="mt-28 space-y-2"> {/* extra top margin to avoid overlap */}
          <p><span className="font-semibold">Name:</span> {form.name}</p>
          <p><span className="font-semibold">Gender:</span> {form.gender}</p>
          <p><span className="font-semibold">Age:</span> {form.age}</p>
          <p><span className="font-semibold">Designation:</span> {form.designation}</p>
          <p><span className="font-semibold">Mobile No:</span> {form.mobile_no}</p>
          <p><span className="font-semibold">Email:</span> {form.email}</p>
          <p><span className="font-semibold">Address:</span> {form.address}</p>

          <button
            onClick={() => window.print()}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
          >
            Print Visitor Pass
          </button>
        </div>
      </section>
    </div>
  );
}
