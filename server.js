// server.js

// 1) เรียกใช้ express
const express = require('express');
const app = express();

// 2) กำหนดพอร์ต (ใช้ process.env.PORT ถ้า deploy บน platform ที่กำหนดพอร์ตมาให้)
const port = process.env.PORT || 8080;

// 3) สร้าง endpoint ตัวอย่าง
app.get('/', (req, res) => {
  res.send('Hello from server.js!');
});

// 4) สั่งให้เซิร์ฟเวอร์ listen ที่พอร์ต
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
