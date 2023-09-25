const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "MyWebTokenSignature";

//ROUTE-1------------------------ Create a User using: POST "/api/auth/createuser". NO login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 6 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success=false;
    // If their are errors, return bad request and that error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Chect whether the user exist with this mail already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, error: "Sorry a user with this email already exists" });
      }

      //Securing Password by hashing and salt using bcrypt

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      // Sending webToken
      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route-2--------------------------------- Authenticate a User using: POST "/api/auth/login". NO login required

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password Cannot be blank").exists(),
  ],
  async (req, res) => {
    let success=false;
    // If their are errors, return bad request and that error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //checking whether a user exists with entered mail or not
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: "Please try to login with correct Credentials" });
      }

      // comparing password entered by user with password at dataBase
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        
        return res
          .status(400)
          .json({ errors: "Please try to login with correct Credentials" });
      }

      // Sending authtoken after authenticating the user
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route-3--------------------------------- get loggedin user details: POST "/api/auth/getuser". login required

router.post(
  "/getuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password Cannot be blank").exists(),
  ], fetchuser,
  async (req, res) => {
    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
