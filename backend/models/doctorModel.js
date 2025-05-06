import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  line1: { type: String, required: true }, // жишээ нь: БЗД, 26-р хороо
  line2: { type: String, required: true }  // жишээ нь: Улаанбаатар, Монгол
}, { _id: false });

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  speciality: { type: String, required: true },     // Жишээ нь: Сэтгэл зүйч
  degree: { type: String, required: true },         // Жишээ нь: PhD, MA
  experience: { type: String, required: true },     // Жишээ нь: 5 жил
  about: { type: String, required: true },          // Танилцуулга
  available: { type: Boolean, default: true },
  fees: { type: Number, required: true },
  slots_booked: {
    type: Map,
    of: [String],     // ['10:00 AM', '11:00 AM']
    default: {}
  },
  address: { type: addressSchema, required: true },
  date: { type: Date, default: Date.now },

  // 🆕 Нэмэлтүүд
  rating: { type: Number, default: 0 },             // Дундаж үнэлгээ
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: String,
      stars: Number,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { minimize: false });

const doctorModel = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
export default doctorModel;
