

/* ================= SEND OTP ================= */
// app.post("/api/auth/send-otp", (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.json({ message: "Email required" });
//   }

//   db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
//     if (err) {
//       console.log("DB ERROR:", err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     if (result.length === 0) {
//       return res.json({ message: "User not found" });
//     }

//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     otpStore[email] = otp;

//     console.log("Generated OTP:", otp);

//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: "svvrk04@gmail.com",             
//         pass: "xkldpqrsabcdefgh"  
//       }
//     });

//     const mailOptions = {
//       from: "svvrk04@gmail.com",  
//       to: email,
//       subject: "Sweet Shop Password Reset OTP",
//       text: `Your OTP for password reset is: ${otp}`
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log("MAIL ERROR:", error);
//         return res.status(500).json({ message: "OTP sending failed" });
//       } else {
//         console.log("MAIL SENT:", info.response);
//         return res.json({ message: "OTP sent successfully" });
//       }
//     });
//   });
// });

/* ================= VERIFY OTP ================= */
// app.post("/api/auth/verify-otp", (req, res) => {
//   const { email, otp } = req.body;

//   if (otpStore[email] === otp) {
//     return res.json({ message: "OTP verified" });
//   } else {
//     return res.json({ message: "Invalid OTP" });
//   }
// });

/* ================= RESET PASSWORD ================= */
// app.post("/api/auth/reset-password", async (req, res) => {
//   const { email, newPassword } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     db.query(
//       "UPDATE users SET password = ? WHERE email = ?",
//       [hashedPassword, email],
//       (err, result) => {
//         if (err) {
//           console.log("RESET ERROR:", err);
//           return res.status(500).json({ message: "Error updating password" });
//         }

//         delete otpStore[email];
//         return res.json({ message: "Password reset successful" });
//       }
//     );
//   } catch (err) {
//     console.log("HASH ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });



const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "vamsi@2004",
  database: "ecommerce_db"
});

db.connect(err => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database ✅");
  }
});

/* ================= REGISTER ================= */

app.post("/api/auth/register", async (req, res) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {

    if (result.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ message: "Registration failed" });

        res.json({ message: "Registration Successful" });
      }
    );
  });
});

/* ================= LOGIN ================= */

app.post("/api/auth/login", (req, res) => {

  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {

    if (result.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  });
});

/* ================= ADD TO CART ================= */

app.post("/api/cart/add", (req, res) => {

  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ message: "Missing data" });
  }

  db.query(
    "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
    [user_id, product_id],
    (err, result) => {

      if (result.length > 0) {

        db.query(
          "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
          [quantity || 1, user_id, product_id],
          (err) => {
            if (err) return res.status(500).json({ message: "Update failed" });
            res.json({ message: "Cart updated ✅" });
          }
        );

      } else {

        db.query(
          "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
          [user_id, product_id, quantity || 1],
          (err) => {
            if (err) return res.status(500).json({ message: "Insert failed" });
            res.json({ message: "Added to cart ✅" });
          }
        );
      }
    }
  );
});

/* ================= GET CART ================= */

app.get("/api/cart/:user_id", (req, res) => {

  const user_id = req.params.user_id;

  const query = `
    SELECT 
      cart.product_id AS id, 
      products.name, 
      products.price,
      IFNULL(products.image, '') AS image,
      cart.quantity
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  db.query(query, [user_id], (err, result) => {

    if (err) {
      console.log("CART FETCH ERROR:", err);   // 🔥 VERY IMPORTANT
      return res.status(500).json([]);
    }

    res.json(result);
  });
});
/* ================= UPDATE QUANTITY ================= */

app.put("/api/cart/update", (req, res) => {

  const { user_id, product_id, quantity } = req.body;

  db.query(
    "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
    [quantity, user_id, product_id],
    (err) => {
      if (err) return res.status(500).json({ message: "Update failed" });
      res.json({ message: "Quantity updated" });
    }
  );
});

/* ================= REMOVE ITEM ================= */

app.delete("/api/cart/remove", (req, res) => {

  const { user_id, product_id } = req.body;

  db.query(
    "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
    [user_id, product_id],
    (err) => {
      if (err) return res.status(500).json({ message: "Remove failed" });
      res.json({ message: "Item removed" });
    }
  );
});

/* ================= START SERVER ================= */

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000 🚀");
});