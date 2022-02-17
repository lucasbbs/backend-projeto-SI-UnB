import mongoose from 'mongoose';
const questionSchema = mongoose.Schema(
  {
    command: {
      type: {},
      required: true,
    },
    options: {
      type: [{}],
      validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
    },
    correctOption: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 4;
}

const Question = mongoose.model('Question', questionSchema);

export default Question;
