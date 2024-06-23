// Import required modules and initialize Express app
const express = require("express");
const app = express();
const dfff = require("dialogflow-fulfillment"); //Change this to LLM (CHATGPT)
const {
  choosingroute,
  getStrategy,
  updateParameterValues,
  getExercise1,
  createNewSessionData,
  getExercise2,
} = require("./choosingresponse");
const { users } = require("./usersData");
var fs = require("firebase-admin");
var forDisabilityPurposes = 0;

// Define the root endpoint which returns a live status
app.get("/", (req, res) => {
  res.send("We are live");
});

// Define the main webhook endpoint that Dialogflow will call
app.post("/", express.json(), (req, res) => {
  const agent = new dfff.WebhookClient({
    request: req,
    response: res,
  });

   // A demo function for testing the webhook
  function demo(agent) {
    var message = agent.add("Sending response from Webhook server");
  }

  // Custom intent handlers follow here:
  // Each function is async and they correspond to different Dialogflow intents
  // The names like _1DefaultWelcomeIntent_custom represent custom handlers for the intents
  // Each handler performs specific actions like creating session data, retrieving exercises, 
  // and interacting with Firestore to get user-specific data
  // ...
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

    [medicalCondition, disability] = await fs
      .firestore()
      .collection("Users")
      .doc(users[sessionID].personNameCR)
      .get()
      .then(function (doc) {
        return [doc.data().medicalCondition, doc.data().disability]; //must return variable, if not cannot access it outside of this block
      });

    if (forDisabilityPurposes == 1) {
      disability = disability - 1;
      console.log(disability);
    }

    exerciseName = await fs
      .firestore()
      .collection(`Selection`)
      .doc(medicalCondition)
      .get()
      .then(function (doc) {
        return doc.data().disability[disability];
      });

    console.log(exerciseName);

    additionalDetails = await fs
      .firestore()
      .collection(medicalCondition)
      .doc(exerciseName)
      .get()
      .then(function (doc) {
        return doc.data().additionalInfoIfAgree; //must return variable, if not cannot access it outside of this block
      });
    console.log(additionalDetails);
    agent.add("Let's get moving! " + additionalDetails);
  }

  async function _3bidontWantToDoExercise_WhyWebhookResponse(agent) {
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
    forDisabilityPurposes = forDisabilityPurposes + 1;
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
      exercise = await _8SuggestNewExercise(agent);
      agent.add("What about " + exercise + " instead?");
      return;
    } else if (users[sessionID].persuasionAttempt == 6) {
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
  }


  // The intent map is a way to map intent names (from Dialogflow) to handler functions
  var intentMap = new Map();

  // Add intent names and corresponding functions to the intent map
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

  // Process the request with the mapped intent handlers
  agent.handleRequest(intentMap);
});

// Start the server on port 3333
app.listen(3333, () => console.log("Server is live at port 3333."));
