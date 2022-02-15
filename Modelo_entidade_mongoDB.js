import mongoose from 'mongoose';
import Investment from './investmentModel.js';
import Salary from './salaryModel.js';
import Category from './categoyModel.js';
import UserCategory from './userCategoryModel.js';
import bcrypt from 'bcryptjs';
import Transaction from './transactionModel.js';
import UserRegister from './userRegisterModel.js';
import Broker from './brokerModel.js';
import Account from './accountModel.js';
import ResetLogin from './resetLoginModel.js';
import Calendar from './calendarModel.js';
import InvestmentProject from './investmentProjectModel.js';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isValidated: {
      type: Boolean,
      default: false,
    },
    country: {
      type: String,
      required: false,
      default: 'BR',
    },
    currency: {
      type: String,
      required: false,
      default: 'BRL',
    },
    monthlySalary: {
      type: Number,
      required: false,
    },
    equityObjective: {
      type: Number,
      required: false,
    },
    isFirstAccess: {
      type: Boolean,
      default: true,
    },
    isSendNotificationsActivated: {
      type: Boolean,
      default: false,
    },
    isSendDueDatesNotificationsActivated: {
      type: Boolean,
      default: true,
    },
    isSendBondYieldDatesNotificationsActivated: {
      type: Boolean,
      default: true,
    },
    hasRegisteredInvest: {
      type: Boolean,
      default: false,
    },
    isFirstAccessInInvestTab: {
      type: Boolean,
      default: true,
    },
    defaultAccount: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Account',
    },
    graph1Account: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Account',
    },
    graph2Account: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Account',
    },
    graph3Account: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Account',
    },
    fundsToInvest: {
      type: Object,
      required: false,
      default: {
        BRL: 0,
      },
    },
    googleID: { type: String, required: false },
    linkedinID: { type: String, required: false },
    facebookID: { type: String, required: false },
    thumbnail: { type: String, required: false },
    // expire_at: {
    //   type: Date,
    //   default: new Date(Date.now() + 4320 * 60000) || null,
    //   expires: 259200,
    // },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  this.wasNew = this.isNew;
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.post('save', async function (next) {
  if (this.wasNew) {
    await Calendar.create({
      name: 'Investment due dates',
      color: '#4917f0ff',
      user: this._id,
    });
  }
});

userSchema.post('save', async function () {
  const categoriesFromUser = await UserCategory.find({
    user: this._id,
  });

  if (categoriesFromUser.length === 0) {
    const categories = await Category.find();

    categories.forEach((cat) => {
      cat._doc = {
        ...cat._doc,
        user: this._id,
        _id: mongoose.Types.ObjectId(),
      };
    });
    await UserCategory.insertMany(categories);
  }
});

userSchema.pre('remove', async function () {
  await Transaction.remove({
    user: this._id,
  }).exec();
  await Investment.remove({
    user: this._id,
  }).exec();
  await Salary.remove({
    user: this._id,
  }).exec();
  await Broker.remove({
    user: this._id,
  }).exec();
  await Account.remove({
    user: this._id,
  }).exec();
  await UserCategory.remove({
    user: this._id,
  }).exec();
  await UserRegister.remove({
    user: this._id,
  }).exec();
  await InvestmentProject.remove({
    user: this._id,
  }).exec();
  await Calendar.remove({
    user: this._id,
  }).exec();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const resetLogin = await ResetLogin.findOne({
    user: this._id,
  }).sort({
    $natural: -1,
  });

  return [
    await bcrypt.compare(enteredPassword, this.password),
    resetLogin &&
      (await bcrypt.compare(enteredPassword, resetLogin.tempPassword)),
  ];
};
const User = mongoose.model('User', userSchema);

export default User;
