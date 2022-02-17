import User from '../models/userModel.js';

export const signup = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({
      error: 'Email is taken',
    });
  }
  const { name, username, email, password } = req.body;

  let profile = `${process.env.CLIENT_URL}/profile/${username}`;

  let newUser = new User({
    name,
    username,
    email,
    password,
    profile,
    username,
  });
  console.log(req.query, req.path, req.body);

  try {
    console.log(req.body);
    await newUser.save();
  } catch (error) {
    console.log(error);
  }
};
