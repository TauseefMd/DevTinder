const express = require("express");

const app = express();

app.get("/user/:userId/:name", (req, res) => {
  console.log(req.params);
  res.send({
    firstName: "Md",
    lastName: "Tauseef",
  });
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000.......");
});
