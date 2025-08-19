import db from "../database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const salt = 10;

export const signupUser = (req, res) => {
  const sql = "INSERT INTO users (`name`,`email`,`password`,`role`)VALUES (?)";
  const password = req.body.password;
  bcrypt.hash(password.toString(), salt, (err, hash) => {
    if (err) {
      console.log(err);
    }
    const value = [req.body.name, req.body.email, hash, req.body.role || "user"];
    db.query(sql, [value], (err, result) => {
      if (err) return console.log(err);
      return res.json(result);
    });
  });
};

export const loginUser = (req, res) => {
  const sql = "SELECT * FROM users WHERE `email` = ?";
  db.query(sql, [req.body.email], (err, result) => {
    if (err) return res.json(err);

    if (result.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        result[0].password,
        (err, isMatch) => {
          if (err) return res.json("err");

          if (isMatch) {
            const id = result[0].id;
            const role = result[0].role;
            const token = jwt.sign({ id,role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.json({ auth: true, token ,role});
          } else {
            return res.json({ auth: false, message: "Wrong password" });
          }
        }
      );
    } else {
      return res.json({ auth: false, message: "Invalid email" });
    }
  });
};

