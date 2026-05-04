const mongoose = require("mongoose");
const visitorRegistrationModel = require("../models/VisitorModel.js");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

function GenerateVisitorID() {
  let visitor_id = "V";
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < 6; i++) {
    visitor_id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return visitor_id;
}

/* ================= REGISTER VISITOR ================= */
const registerVisitor = async (req, res) => {
  try {
    const formData = req.body;

    // ✅ validations
    if (!formData.mobile_no) {
      return res.status(400).json({ message: "Mobile number required" });
    }

    if (formData.email) {
      const emailExists = await visitorRegistrationModel.findOne({ email: formData.email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const mobileExists = await visitorRegistrationModel.findOne({ mobile_no: formData.mobile_no });
    if (mobileExists) {
      return res.status(400).json({ message: "Mobile already exists" });
    }

    // ✅ function to save visitor
    const saveVisitor = async (imageUrl = "") => {
      const visitor = await visitorRegistrationModel.create({
        admin: req.admin._id,
        visitor_id: GenerateVisitorID(),
        name: formData.name,
        gender: formData.gender,
        age: formData.age,
        designation: formData.designation,
        mobile_no: formData.mobile_no,
        email: formData.email,
        address: formData.address,
        check_in: formData.check_in || "",
        check_out: formData.check_out || "",
        profile_image: imageUrl,
      });

      return res.status(201).json(visitor);
    };

    // ✅ if image present → upload
    if (req.file) {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "visitors" },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary Error:", error);
            return res.status(500).json({ message: "Image upload failed" });
          }

          return saveVisitor(result.secure_url);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } else {
      return saveVisitor();
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
  console.log("FILE:", req.file);
};

/* ================= GET ALL ================= */
const getVisitorsDetails = async (req, res) => {
  try {
    const data = await visitorRegistrationModel.find({ admin: req.admin._id });
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/* ================= GET ONE ================= */
const getSingleVisitorData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const visitor = await visitorRegistrationModel.findById(id);

    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    if (visitor.admin.toString() !== req.admin._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json(visitor);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/* ================= UPDATE ================= */
const updateSingleVisitorData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const visitor = await visitorRegistrationModel.findById(id);

    if (!visitor) return res.status(404).json({ message: "Not found" });

    if (visitor.admin.toString() !== req.admin._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await visitorRegistrationModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json(updated);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/* ================= DELETE ================= */
const deleteSingleVisitorData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const visitor = await visitorRegistrationModel.findById(id);

    if (!visitor) return res.status(404).json({ message: "Not found" });

    if (visitor.admin.toString() !== req.admin._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✅ delete image from Cloudinary
    if (visitor.profile_image) {
      const parts = visitor.profile_image.split("/");
      const file = parts[parts.length - 1];
      const publicId = "visitors/" + file.split(".")[0];

      await cloudinary.uploader.destroy(publicId);
    }

    await visitor.deleteOne();

    res.status(200).json({ message: "Deleted successfully" });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  registerVisitor,
  getVisitorsDetails,
  getSingleVisitorData,
  updateSingleVisitorData,
  deleteSingleVisitorData,
};