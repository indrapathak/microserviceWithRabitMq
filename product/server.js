const express = require("express");

const app = express();
const amp = require("amqplib/callback_api");
const port = 5001;

app.use("/product", (request, response) => {
  amp.connect("amqp://localhost", function (err, conn) {
    conn.createChannel(function (err, ch) {
      const queue = "userMessageQueue";
      ch.consume(
        queue,
        function (msg) {
          console.log("message in product is", msg.content.toString());
          response.send(msg.content.toString());
        },
        { noAck: true }
      );
    });
  });
});

app.listen(port, () => console.log(`product server is running on ${port}`));
