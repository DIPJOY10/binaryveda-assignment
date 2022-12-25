const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connection_url =
  "mongodb+srv://bv_test:bv1234@cluster0.hsnw3jb.mongodb.net/?retryWrites=true&w=majority";

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
