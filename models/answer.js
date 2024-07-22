import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    formId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },

    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    },
  },

  {
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000),
    },
    strict: false,
  }
);

export default mongoose.model("Answer", Schema);
