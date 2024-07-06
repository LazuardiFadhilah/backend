import User from "../models/User.js";

class AuthController {
  async register(req, res) {
    const { fullname, email, password } = req.body;
    try {
      const user = await User.create({ fullname, email, password });
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
