const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const PORT = process.env.PORT || 8080;

//mongodb connection
mongoose.set("strictQuery", false);
console.log(process.env.MONGODB_URL);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connect to database"))
  .catch((err) => console.log(err));

// schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
});

//
const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res) => {
  res.send("Server is running very fast!");
});

//signup
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  const resultData = await userModel.findOne({ email: email });
  console.log(resultData);
  if (!resultData) {
    const data = userModel(req.body);
    const save = data.save();
    res.send({ message: "Successfully signed up", alert: true });
  } else {
    res.send({ message: "email id is already registered", alert: false });
  }
});

//api login
app.post("/login", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  const result = await userModel.findOne({ email: email });
  if (result) {
    const dataSend = {
      _id: result._id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
    };
    console.log(dataSend);
    res.send({ message: "Login is successful", alert: true, data: dataSend });
  } else {
    res.send({
      message: "Email is not available, Please sign up",
      alert: false,
    });
  }
});

//product section

const schemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("product", schemaProduct);

//save product in database
//api
app.post("/uploadProduct", async (req, res) => {
  console.log(req.body);
  const data = productModel(req.body);
  const datasave = await data.save();

  res.send({ message: "Uploaded successfully" });
});

//
app.get("/product", async (req, res) => {
  const data = await productModel.find({});
  res.send(JSON.stringify(data));
});

//Server is running
app.listen(PORT, () => console.log("Server is running at port: " + PORT));
console.log(process.env.HELLO_WORLD);
