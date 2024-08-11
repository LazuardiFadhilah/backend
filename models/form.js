import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    question: {
      type: [
        {
          id: {
            type: mongoose.Schema.ObjectId,
          },
          question: {
            type: String,
            default: null,
          },
          type: {
            type: String,
          },
          required: {
            type: Boolean,
            default: false,
          },
          options: [
            {
              id: {
                type: mongoose.Schema.ObjectId,
              },
              value: {
                type: String,
              },
            },
          ],
        },
      ],
    },
    invites: {
      type: Array,
    },
    public: {
      type: Boolean,
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
  }
);

Schema.plugin(mongoosePaginate);

Schema.virtual("answers", {
  ref: "Answer",
  localField: "_id",
  foreignField: "formId",
});

export default mongoose.model("Form", Schema);
