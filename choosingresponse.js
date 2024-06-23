var fs = require("firebase-admin");

var serviceAccount = require("./admin.json");

fs.initializeApp({
  credential: fs.credential.cert(serviceAccount), 
  databaseURL:
    "https://fyp-chatbot-6496a-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = fs.firestore();

const { users } = require("./usersData");
// const { sessionID } = require("./index");

// async function trialFunction() {
//   const documentRef = await db.collection("Strategies").doc("Diabetes").get();
//   const strategy = documentRef.get("1");
//   return strategy[1];
// }

function createNewSessionData(sessionID) {
  console.log("createSessionData");
  users[sessionID] = {
    y_c: 0,
    y_p: 1,
    strategyWeights: {
      central: [0.2, 0.2, 0.2, 0.2, 0.2],
      peripheral: [0.167, 0.167, 0.167, 0.167, 0.167, 0.167],
    },

    selectedStrategies: {
      central: [1, 1, 1, 1, 1],
      peripheral: [1, 1, 1, 1, 1, 1],
    },
    strategyIndexChosen: 0,
    specificStrategyIndex: 0,
    exerciseIndex: 0,
    firstTime: 1,
    exerciseName: "",
    personNameCR: "",
    medicalCondition: "",
    disability: 0,
    persuasionAttempt: 0,
  };
  // console.log(users[sessionID]);
}

async function getExercise1(sessionID) {
  // console.log("getExercise");
  // console.log(sessionID);
  // console.log("getExercise2");
  // console.log(users[sessionID].medicalCondition);
  [users[sessionID].medicalCondition, users[sessionID].disability] = await db
    .collection("Users")
    .doc(users[sessionID].personNameCR)
    .get()
    .then(function (doc) {
      return [doc.data().medicalCondition, doc.data().disability]; //must return variable, if not cannot access it outside of this block
    });
  // console.log("halfway");
  console.log(
    users[sessionID].medicalCondition + " " + users[sessionID].disability
  );

  users[sessionID].exerciseName = await db
    .collection(`Selection`)
    .doc(users[sessionID].medicalCondition)
    .get()
    .then(function (doc) {
      return doc.data().disability[users[sessionID].disability];
    });

  console.log(users[sessionID].exerciseName);
  return users[sessionID].exerciseName;
}

async function getExercise2(sessionID) {
  [users[sessionID].medicalCondition, users[sessionID].disability] = await db
    .collection("Users")
    .doc(users[sessionID].personNameCR)
    .get()
    .then(function (doc) {
      return [doc.data().medicalCondition, doc.data().disability - 1]; //must return variable, if not cannot access it outside of this block
    });
  // console.log("halfway");
  console.log(
    users[sessionID].medicalCondition + " " + users[sessionID].disability
  );

  users[sessionID].exerciseName = await db
    .collection(`Selection`)
    .doc(users[sessionID].medicalCondition)
    .get()
    .then(function (doc) {
      return doc.data().disability[users[sessionID].disability];
    });

  console.log(users[sessionID].exerciseName);
  return users[sessionID].exerciseName;
}

async function choosingroute(x_m, sessionID) {
  console.log("choosingroute");
  console.log(users[sessionID].firstTime);
  if (users[sessionID].firstTime == 1) {
    users[sessionID].y_c = x_m * 1; // y_c = x_m * w_cm
    console.log("First time: x_m: " + x_m + " y_c: " + users[sessionID].y_c);
    if (users[sessionID].y_c < 0.5) {
      users[sessionID].y_c = 0;
      users[sessionID].y_p = 1;
    } else {
      users[sessionID].y_c = 1;
      users[sessionID].y_p = 0;
    }
  }

  // y_c values. y_c = 0 means peripheral route is chosen. y_c = 1 means central route is chosen.
  if (users[sessionID].y_c < 0.5) {
    candidateStrategiesWeights = users[sessionID].strategyWeights.peripheral;
    candidateSelectedStrategies =
      users[sessionID].selectedStrategies.peripheral;
    // console.log(candidateStrategiesWeights);
  } else {
    candidateStrategiesWeights = users[sessionID].strategyWeights.central;
    candidateSelectedStrategies = users[sessionID].selectedStrategies.central;
  }

  console.log(users);

  response = await choosingStrategy(
    Math.max(users[sessionID].y_c, users[sessionID].y_p),
    candidateStrategiesWeights,
    candidateSelectedStrategies,
    sessionID
  );

  return response;
}

async function choosingStrategy(
  y_cORy_p,
  candidateStrategiesWeights,
  candidateSelectedStrategies,
  sessionID
) {
  let activationVectors = [];
  let activationVectorsIndex = 0;
  for (i in candidateStrategiesWeights) {
    activationVectors[activationVectorsIndex] =
      candidateStrategiesWeights[activationVectorsIndex] *
      y_cORy_p *
      candidateSelectedStrategies[activationVectorsIndex];
    activationVectorsIndex = activationVectorsIndex + 1;
  }

  // console.log(activationVectors);
  let maxActivationVectors = Math.max(...activationVectors);
  // console.log(maxActivationVectors);

  // users[sessionID].strategyIndexChosen = index of strategy given the route already chosen. hence, if index 0 is chosen for peripheral route, it means strategy 6 has been selected. have to be var because we need it globally to know which strategy has been last chosen
  users[sessionID].strategyIndexChosen = activationVectors.findIndex(
    (element) => element == maxActivationVectors
  );
  // console.log("users[sessionID].strategyIndexChosen");
  // console.log(users[sessionID].strategyIndexChosen);

  // update ej (candidateSelectedStrategies)
  candidateSelectedStrategies[users[sessionID].strategyIndexChosen] = 0;

  // if peripheral route was chosen
  if (users[sessionID].y_c < 0.5) {
    users[sessionID].selectedStrategies.peripheral =
      candidateSelectedStrategies;
    users[sessionID].strategyIndexChosen =
      users[sessionID].strategyIndexChosen + 5; // index 5
  } else {
    users[sessionID].selectedStrategies.central = candidateSelectedStrategies;
  }

  // console.log("strategyIndexChosen + 1");
  // console.log(users[sessionID].strategyIndexChosen + 1);

  var response = await getStrategy(
    users[sessionID].strategyIndexChosen + 1,
    sessionID
  ); // cannot use let here because we need this variable outside of this function. has to be a global variable.

  // console.log(users[sessionID].selectedStrategies);

  return response;
}

async function getStrategy(strategyNumberChosen, sessionID) {
  const documentRef = await db
    .collection(users[sessionID].medicalCondition)
    .doc(users[sessionID].exerciseName)
    .get();
  const strategy = await documentRef.get(String(strategyNumberChosen));
  strategyResponse = strategy[users[sessionID].specificStrategyIndex];
  // console.log(strategyResponse);

  users[sessionID].specificStrategyIndex =
    (users[sessionID].specificStrategyIndex + 1) % 2;
  return strategyResponse;
}

//successful will be reward value

async function updateParameterValues(successful, sessionID) {
  if (users[sessionID].y_c < 0.5) {
    temporaryStrategyIndexChosen = users[sessionID].strategyIndexChosen - 5;
    users[sessionID].strategyWeights.peripheral[temporaryStrategyIndexChosen] =
      0.1 *
        (1 -
          users[sessionID].strategyWeights.peripheral[
            temporaryStrategyIndexChosen
          ]) *
        successful -
      0.9 *
        users[sessionID].strategyWeights.peripheral[
          temporaryStrategyIndexChosen
        ];

    if (successful) {
      users[sessionID].y_c = users[sessionID].y_c - 0.2;
      users[sessionID].y_p = users[sessionID].y_p + 0.2;
      response = "Great! Let me know how you feel after exercising.";
      return response;
    } else {
      users[sessionID].y_c = users[sessionID].y_c + 0.2;
      users[sessionID].y_p = users[sessionID].y_p - 0.2;
      response = await choosingroute(0, sessionID);
      return response;
    }
  } else {
    //update weight of central strategy
    temporaryStrategyIndexChosen = users[sessionID].strategyIndexChosen;
    users[sessionID].strategyWeights.central[temporaryStrategyIndexChosen] =
      0.1 *
        (1 -
          users[sessionID].strategyWeights.central[
            temporaryStrategyIndexChosen
          ]) *
        successful -
      0.9 *
        users[sessionID].strategyWeights.central[temporaryStrategyIndexChosen];

    if (successful) {
      users[sessionID].y_c = users[sessionID].y_c + 0.2;
      users[sessionID].y_p = users[sessionID].y_p - 0.2;
      response = "Great! Let me know how you feel after exercising.";
      return response;
    } else {
      users[sessionID].y_c = users[sessionID].y_c - 0.1;
      users[sessionID].y_p = users[sessionID].y_p + 0.1;

      response = await choosingroute(0, sessionID);
      return response;
    }
  }
}

exports.choosingroute = choosingroute;
exports.choosingStrategy = choosingStrategy;
exports.getStrategy = getStrategy;
exports.updateParameterValues = updateParameterValues;
exports.getExercise1 = getExercise1;
exports.getExercise2 = getExercise2;
exports.createNewSessionData = createNewSessionData;
