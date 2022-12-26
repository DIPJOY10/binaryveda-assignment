const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

//todo: async
const connection_url = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.hsnw3jb.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connection established!");
  })
  .catch((err) => {
    console.log("database connection unsuccessful!");
    console.log(err);
  });
