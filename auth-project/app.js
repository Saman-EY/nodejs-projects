const express = require("express");
const { ErrorHandler, NotFoundError } = require("./utils/errorHandlers");
const { default: mongoose } = require("mongoose");
const { AllRoutes } = require("./routes/index.route");
const app = express();
mongoose
  .connect("mongodb://localhost:27017/auth-project", {})
  .then(() => console.log("mongoose is connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(AllRoutes);

app.use(NotFoundError);
app.use(ErrorHandler);

app.listen(3000, () => console.log("server is running on https://localhost:3000"));
