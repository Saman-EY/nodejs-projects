const { Schema, Types } = require("mongoose");

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: Types.ObjectId, ref: "category", required: true },
  province: { type: string, required: true },
  city: { type: string, required: true },
  district: { type: string, required: true },
  coordinate: { type: [Number], required: true }, //51.2323, 11.2333
  images: { type: [String], required: false, default: [] },
});
