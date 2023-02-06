const express = require("express");
const app = express();
const dfff = require("dialogflow-fulfillment");
const {
  choosingroute,
  getStrategy,
  updateParameterValues,
  getExercise1,
  createNewSessionData,
  getExercise2,
} = require("./choosingresponse");
const { users } = require("./usersData");

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

  async function _1DefaultWelcomeIntent_custom(agent) {
    sessionID = agent.session;
    createNewSessionData(sessionID);
    // console.log(sessionID);
    // get document ids/names for first time
    var tempName = await agent.context
      .get("username")
      .parameters.person.name.toLowerCase();
    users[sessionID].personNameCR =
      tempName.charAt(0).toUpperCase() + tempName.slice(1); //context must be all small letters to work
    console.log(users[sessionID].personNameCR);
    exerciseName = await getExercise1(sessionID);
    agent.add(
      "Hello " + users[sessionID].personNameCR + ", let's do " + exerciseName
    );
  }

  async function _2initallyAlreadyWantToExercise_Webhook(agent) {
    sessionID = agent.session;
    createNewSessionData(sessionID);
    var tempName = await agent.context.get("username").parameters.name;
    users[sessionID].personNameCR = tempName; //context must be all small letters to work
    console.log(users[sessionID].personNameCR);
    // exerciseName = await getExercise1(sessionID);
    // x_m = 1;
    // response = await choosingroute(x_m, sessionID);
    // users[sessionID].firstTime = 0;
    agent.add("Let's go!");
  }

  async function _3bidontWantToDoExercise_WhyWebhookResponse(agent) {
    //Problem is code below will always run when user says no. Should only run once for intialisation

    // start

    // initialisation. first time user does not want to do activity
    sessionID = await agent.session;
    createNewSessionData(sessionID);
    var tempName = await agent.context.get("username").parameters.name;
    users[sessionID].personNameCR = tempName; //context must be all small letters to work
    console.log(users[sessionID].personNameCR);
    exerciseName = await getExercise1(sessionID);

    // end

    x_m = 0;
    response = await choosingroute(x_m, sessionID); //choosingroute(x_m). x_m represents motivation node. x_m = 0 means motivation is low.
    users[sessionID].firstTime = 0;
    users[sessionID].persuasionAttempt = users[sessionID].persuasionAttempt + 1;
    // response = await trialFunction();
    console.log(response);
    agent.add(response);
  }

  async function _4unsureOfSuccess_WebhookResponse(agent) {
    sessionID = agent.session;
    console.log("_4unsureOfSuccess_WebhookResponse");
    console.log(users[sessionID].strategyIndexChosen);
    response = await getStrategy(
      users[sessionID].strategyIndexChosen + 1,
      sessionID
    );
    agent.add(response);
  }

  async function _5stillDontWantToDoExercise_Webhook(agent) {
    sessionID = agent.session;
    // if users[sessionID].persuasionAttempt== 2, switch to new exercise.
    if (users[sessionID].persuasionAttempt == 3) {
      blahblah = await _8SuggestNewExercise(agent);
      console.log("kill me");
      agent.add("What about " + blahblah + " instead?");
      return;
    } else if (users[sessionID].persuasionAttempt == 6) {
      console.log("haiz");
      _7GiveUp(agent);
      return;
    }

    console.log("outside here");
    // reduce weight of strategy
    // call _3bidontWantToDoExercise_WhyWebhookResponse to choose another strategy (assuming motivation is low? else go to central route)
    let response = await updateParameterValues(0, sessionID);

    agent.add(response);
    users[sessionID].persuasionAttempt = users[sessionID].persuasionAttempt + 1;
  }

  async function _6nowWantToExercise_Webhook(agent) {
    sessionID = agent.session;
    let response = await updateParameterValues(1, sessionID);
    agent.add(response);
  }

  function _7GiveUp(agent) {
    sessionID = agent.session;
    agent.add("Alright. Let me know when you want to do something!");
  }

  async function _8SuggestNewExercise(agent) {
    sessionID = agent.session;
    console.log("_8SuggestNewExercise");
    users[sessionID].persuasionAttempt = users[sessionID].persuasionAttempt + 1;
    exerciseName2 = await getExercise2(sessionID);
    return exerciseName2;
    // agent.add(
    //   "Hello " +
    //     users[sessionID].personNameCR +
    //     ", What about " +
    //     exerciseName2 +
    //     " instead?"
    // );
  }

  var intentMap = new Map();

  intentMap.set("webhookDemo", demo);
  intentMap.set("_1DefaultWelcomeIntent_custom", _1DefaultWelcomeIntent_custom);
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
  intentMap.set("_7GiveUp", _7GiveUp);
  intentMap.set("_8SuggestNewExercise", _8SuggestNewExercise);

  agent.handleRequest(intentMap);
});

// exports.sessionID = sessionID;

app.listen(3333, () => console.log("Server is live at port 3333."));
