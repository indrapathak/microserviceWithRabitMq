const express = require("express");
const amp = require("amqplib/callback_api"); // library to use the rabitMq

const app = express();

const port = 5000;

app.use("/user", (request, response) => {
  let dataObject = {
    id: 1,
    name: "indra",
    lastName: "pathak",
    age: 30,
  };

  amp.connect("amqp://localhost", function (err, conn) {
    conn.createChannel(function (err, ch) {
      const queue = "userMessageQueue";
      const msg = JSON.stringify(dataObject);
      ch.assertQueue(queue, { durable: false });
      ch.sendToQueue(queue, Buffer.from(msg));
      console.log(`${msg} send to ${queue}`);
    });
  });
  response.send({ message: "Response from user service" });
});

app.listen(port, () => console.log(`user server is running on ${port}`));
