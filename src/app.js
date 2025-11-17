const express = require("express");

const app = express();

app.use("/user", (req, res) => {
  res.send({
    firstName: "Md",
    lastName: "Tauseef",
  });
});

app.get("/user", (req, res) => {
  res.send({
    firstName: "Md",
    lastName: "Tauseef",
  });
});

app.post("/user", (req, res) => {
  res.send("User information saved successfully!");
});

app.delete("/user", (req, res) => {
  res.send("Data deleted successfully!");
});

app.patch("/user", (req, res) => {
  res.send("Data is patched");
});

// this will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
  res.send("Hello from the server!");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000.......");
});
