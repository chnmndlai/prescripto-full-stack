import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// ✅ Эмч устгах
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await doctorModel.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Эмч олдсонгүй' });
    res.json({ message: 'Амжилттай устгалаа' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Алдаа гарлаа', error: error.message });
  }
};

// ✅ Эмч нэвтрэх
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await doctorModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "Нэвтрэх мэдээлэл буруу байна." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Нэвтрэх мэдээлэл буруу байна." });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Эмчийн цагийн захиалгууд авах
const appointmentsDoctor = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const appointments = await appointmentModel.find({ docId: doctorId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Эмч цаг цуцлах
const appointmentCancel = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId.toString() === doctorId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
      return res.json({ success: true, message: 'Цаг амжилттай цуцлагдлаа.' });
    }

    res.json({ success: false, message: 'Цуцлах боломжгүй байна.' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Эмч цаг дуусгасан тэмдэглэл хийх
const appointmentComplete = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId.toString() === doctorId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
      return res.json({ success: true, message: 'Цаг амжилттай дууссан гэж тэмдэглэлээ.' });
    }

    res.json({ success: false, message: 'Дууссан болгон боломжгүй байна.' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Бүх эмчийн жагсаалт
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email']);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Эмчийн боломжит байдлыг өөрчлөх
const changeAvailablity = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Эмч олдсонгүй' });

    await doctorModel.findByIdAndUpdate(doctorId, { available: !doctor.available });
    res.json({ success: true, message: 'Боломжит байдал амжилттай солигдлоо.' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Эмчийн профайл авах
const doctorProfile = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const doctor = await doctorModel.findById(doctorId).select('-password');
    if (!doctor) return res.status(404).json({ success: false, message: 'Эмч олдсонгүй' });

    res.json({ success: true, doctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Эмчийн профайл шинэчлэх
const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(doctorId, { fees, address, available });
    res.json({ success: true, message: 'Профайл шинэчлэгдлээ.' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Эмчийн хяналтын самбарын дата
const doctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const appointments = await appointmentModel.find({ docId: doctorId });

    let earnings = 0;
    let patients = [];

    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
      if (!patients.includes(item.userId.toString())) {
        patients.push(item.userId.toString());
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse()
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  doctorList,
  changeAvailablity,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  deleteDoctor,
};
