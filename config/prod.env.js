module.exports = {
  database:"mongodb://localhost:27017/task",
  port: 4000,
  pass: process.env.EMAIL_PASS,
  origin: "http://localhost:3000",
  cors: "http://localhost:3000"
};
// node --max-old-space-size=8192
