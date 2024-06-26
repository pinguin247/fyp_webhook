const express = require("express");
const app = express();
const dfff = require("dialogflow-fulfillment");
const {
  choosingroute,
  getStrategy,
  others,
  updateParameterValues,
} = require("./choosingresponse");

const TG = require("node-telegram-bot-api");

// Async function that checks a database and alerts a user through Telegram
async function checkDBAndAlertUser() {
  // Telegram bot token and initialization
  const token = "5713809336:AAGbpn4lBjk9rnDiEMEI6OG-g-cip7OQtnM";
  let telegramBot = new TG(token, { polling: true });

  // check DB

  onreadystatechange = function () {
    telegramBot.sendMessage("679654", "test");
  };

  open("GET", url, true);
  send();

  await telegramBot.stopPolling();

  // Set up a webhook for the Telegram bot
  telegramBot
    .setWebHook(
      app.get("/", (req, res) => {
        res.send("We are live");
      })
    )
    .then((r) => console.log("webhook response: " + r))
    .catch((err) => console.log("webhook error: " + err.message));
}

// Call the checkDBAndAlertUser function
checkDBAndAlertUser();

// Endpoint to handle POST requests
app.post("/", express.json(), (req, res) => {
  const agent = new dfff.WebhookClient({
    request: req,
    response: res,
  });

  // Define webhook functions for different Dialogflow intents
  function demo(agent) {
    agent.add("Sending response from Webhook server");
  }

  // The following functions handle various Dialogflow intents
  // They set variables, choose responses, and send them back to the user
  // The functions use the imported 'choosingroute', 'getStrategy', and 'updateParameterValues' functions
  // from the 'choosingresponse' module to determine the response based on the user's state or input
  function _2initallyAlreadyWantToExercise_Webhook(agent) {
    x_m = 1;
    response = choosingroute(x_m);
    others.firstTime = 0;
    agent.add(response);
  }

  function _3bidontWantToDoExercise_WhyWebhookResponse(agent) {
    // initialisation. first time user does not want to do activity
    x_m = 0;
    response = choosingroute(x_m); //choosingroute(x_m). x_m represents motivation node. x_m = 0 means motivation is low.
    others.firstTime = 0;
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
