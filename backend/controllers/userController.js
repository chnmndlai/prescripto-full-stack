import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary';
import stripe from "stripe";
import razorpay from 'razorpay';

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Бүх талбарыг бөглөнө үү.' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Зөв имэйл оруулна уу." });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Нууц үг дор хаяж 8 тэмдэгт байх ёстой." });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Энэ имэйл аль хэдийн бүртгэгдсэн байна." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ success: true, token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Хэрэглэгч олдсонгүй." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Имэйл эсвэл нууц үг буруу байна." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId).select('-password');
    res.json({ success: true, userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({ success: false, message: "Мэдээлэл дутуу байна." });
    }

    await userModel.findByIdAndUpdate(req.userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender
    });

    if (imageFile) {
      const uploaded = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      await userModel.findByIdAndUpdate(req.userId, { image: uploaded.secure_url });
    }

    res.json({ success: true, message: 'Профайл шинэчлэгдлээ.' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.userId;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.status(400).json({ success: false, message: 'Эмч одоогоор завгүй байна.' });
    }

    let slots_booked = docData.slots_booked || {};
    if (!slots_booked[slotDate]) slots_booked[slotDate] = [];

    if (slots_booked[slotDate].includes(slotTime)) {
      return res.status(400).json({ success: false, message: 'Энэ цаг аль хэдийн захиалагдсан байна.' });
    }

    slots_booked[slotDate].push(slotTime);
    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;

    const newAppointment = new appointmentModel({
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    });

    await newAppointment.save();
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: 'Цаг амжилттай захиалагдлаа.' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({ success: false, message: 'Захиалга олдсонгүй.' });
    }

    if (appointmentData.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Зөвшөөрөгдөөгүй үйлдэл.' });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (!doctorData.slots_booked || !doctorData.slots_booked[slotDate]) {
      return res.json({ success: true, message: 'Цаг цуцлагдлаа (цагийн мэдээлэл бүртгэгдээгүй байсан).' });
    }

    doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(e => e !== slotTime);
    await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });

    res.json({ success: true, message: 'Цаг цуцлагдлаа.' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const listAppointment = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.status(400).json({ success: false, message: 'Захиалга олдсонгүй эсвэл цуцлагдсан байна.' });
    }

    const order = await razorpayInstance.orders.create({
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    });

    res.json({ success: true, order });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === 'paid') {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      return res.json({ success: true, message: "Төлбөр амжилттай." });
    }

    res.json({ success: false, message: 'Төлбөр амжилтгүй.' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleSavedAdvice = async (req, res) => {
  const userId = req.userId;
  const { adviceId } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'Хэрэглэгч олдсонгүй' });

    const alreadySaved = user.savedAdvice.includes(adviceId);

    if (alreadySaved) {
      user.savedAdvice.pull(adviceId);
    } else {
      user.savedAdvice.push(adviceId);
    }

    await user.save();
    res.json({ success: true, saved: !alreadySaved });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Алдаа гарлаа' });
  }
};

const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const { origin } = req.headers;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.cancelled) {
      return res.status(400).json({ success: false, message: 'Захиалга олдсонгүй эсвэл цуцлагдсан байна.' });
    }

    const currency = process.env.CURRENCY.toLowerCase();

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
      cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
      line_items: [{
        price_data: {
          currency,
          product_data: { name: "Appointment Fee" },
          unit_amount: appointmentData.amount * 100
        },
        quantity: 1
      }],
      mode: 'payment'
    });

    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyStripe = async (req, res) => {
  try {
    const { appointmentId, success } = req.body;

    if (success === "true") {
      await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
      return res.json({ success: true, message: 'Төлбөр амжилттай.' });
    }

    res.json({ success: false, message: 'Төлбөр амжилтгүй.' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  cancelAppointment,
  listAppointment,
  paymentRazorpay,
  verifyRazorpay,
  paymentStripe,
  verifyStripe,
  toggleSavedAdvice,
};
