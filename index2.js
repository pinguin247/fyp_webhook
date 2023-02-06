// const fs = require("fs");

// let rawdata = fs.readFileSync("parameters.json");
// let student = JSON.parse(rawdata);
// console.log(student);

// import { choosingroute } from "./choosingresponse";

const express = require("express");
const app = express();
const dfff = require("dialogflow-fulfillment");
const {
  choosingroute,
  getStrategy,
  others,
  updateParameterValues,
} = require("./choosingresponse");

app.get("/", (req, res) => {
  res.send("We are live");
});

app.post("/", express.json(), (req, res) => {
  const agent = new dfff.WebhookClient({
    request: req,
    response: res,
  });

  function demo(agent) {
    var message = agent.add("Sending response from Webhook server");
  }

  // function customPayloadDemo(agent) {
  //   var payloadData = {
  //     richContent: [
  //       [
  //         {
  //           type: "accordion",
  //           title: "Accordion title",
  //           subtitle: "Accordion subtitle",
  //           image: {
  //             src: {
  //               rawUrl: "https://example.com/images/logo.png",
  //             },
  //           },
  //           text: "Accordion text",
  //         },
  //       ],
  //     ],
  //   };

  //   agent.add(
  //     new dfff.Payload(agent.UNSPECIFIED, payloadData, {
  //       sendAsMessage: true,
  //       rawPayload: true,
  //     })
  //   );
  // }

  function _2initallyAlreadyWantToExercise_Webhook(agent) {
    x_m = 1;
    response = choosingroute(x_m);
    agent.add(response);
  }

  function _3bidontWantToDoExercise_WhyWebhookResponse(agent) {
    // initialisation. first time user does not want to do activity
    x_m = 0;
    response = choosingroute(x_m); //choosingroute(x_m). x_m represents motivation node. x_m = 0 means motivation is low.
    // console.log(response);
    agent.add(response);
  }

  function _4unsureOfSuccess_WebhookResponse(agent) {
    console.log("_4unsureOfSuccess_WebhookResponse");
    console.log(others.strategyIndexChosen);
    response = getStrategy(others.strategyIndexChosen + 1);
    agent.add(response);
  }

  function _5stillDontWantToDoExercise_Webhook(agent) {
    // reduce weight of strategy
    // call _3bidontWantToDoExercise_WhyWebhookResponse to choose another strategy (assuming motivation is low? else go to central route)
    let response = updateParameterValues(0);
    agent.add(response);
  }

  function _6nowWantToExercise_Webhook(agent) {
    let response = updateParameterValues(1);
    agent.add(response);
  }

  var intentMap = new Map();

  intentMap.set("webhookDemo", demo);
  // intentMap.set("customPayloadDemo", customPayloadDemo);
  intentMap.set(
    "_2initallyAlreadyWantToExercise_Webhook",
    _2initallyAlreadyWantToExercise_Webhook
  );
  intentMap.set(
    "_3bidontWantToDoExercise_WhyWebhookResponse",
    _3bidontWantToDoExercise_WhyWebhookResponse
  );
  intentMap.set(
    "_4unsureOfSuccess_WebhookResponse",
    _4unsureOfSuccess_WebhookResponse
  );
  intentMap.set(
    "_5stillDontWantToDoExercise_Webhook",
    _5stillDontWantToDoExercise_Webhook
  );
  intentMap.set("_6nowWantToExercise_Webhook", _6nowWantToExercise_Webhook);

  agent.handleRequest(intentMap);
});

app.listen(3333, () => console.log("Server is live at port 3333."));
