import User from "../models/User.js";
import bcryptjs from 'bcryptjs';

export const signUpUser = async (req, res) => {
  try {
    const { username, email, password, gender } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "Username Already Exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      gender
    });

    if (newUser) {
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        gender: newUser.gender
      });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.log("Error in Signup Controller", error.message);
    res.status(500).json({ error: `Internal Server Error ${error}` });
  }
}


export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid Username Or Password" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid Username Or Password" });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      password: user.password,
    });
  } catch (error) {
    console.log("Error in login Controller", error.message);
    res.status(500).json({ error: `Internal Server Error ${error.message}` });
  }
};



export const logoutUser= async (req,res) => {
    try{
        res.cookie("jwt","",{ maxAge: 0 });
        res.status(200).json({message:"Logged Out Succcessfully!"});
    }
    catch(error){
        console.log("Error in logout Controller",error.message);

        res.status(500).json({error:`Internal Server Error ${error}`})
    
    }
}