import Advertiser from "../models/Advertiser.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

// התחברות
export const login = async (req, res) => {
  const { password, email } = req.body;

  try {
    const advertiser = await Advertiser.findOne({ email });
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, advertiser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: advertiser._id, email: advertiser.email },
      process.env.SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ advertiser, token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// הרשמה
export const signin = async (req, res) => {
    const {name, email, password, phone, phone_other} = req.body;  // שם נוסף
    console.log(req.body);
   

    try {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }
  
      const existing = await Advertiser.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email must be unique." });
      }
  
      const hashPassword = await bcrypt.hash(password, 10);
      const newAdvertiser = new Advertiser({
        email,
        password: hashPassword,
        phone,
        phone_other,
        name
      });
  
      await newAdvertiser.save();
  
      const token = jwt.sign(
        { id: newAdvertiser._id, email: newAdvertiser.email, name: newAdvertiser.name },
        process.env.SECRET,
        { expiresIn: "7d" }
      );
  
      return res.status(201).json({ advertiser: newAdvertiser, token });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
  


// שליפת כל המפרסמים
export const getAll = (req, res) => {
  Advertiser.find()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(500).json({ error: err.message }));
};

// שליפה לפי מזהה
export const getById = (req, res) => {
  Advertiser.findById(req.params.id)
    .then((advertiser) => {
      if (!advertiser) {
        return res.status(404).json({ error: "Advertiser not found" });
      }
      res.status(200).json(advertiser);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};
