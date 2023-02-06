const { List } = require("actions-on-google");

// let w1c = 0.2; // initial value of central route strategy 1
// let w2c = 0.2; // initial value of central route strategy 2
// let w3c = 0.2; // initial value of central route strategy 3
// let w4c = 0.2; // initial value of central route strategy 4
// let w5c = 0.2; // initial value of central route strategy 5
// let w6c = 0.167; // initial value of peripheral route strategy 1
// let w7c = 0.167; // initial value of peripheral route strategy 2
// let w8c = 0.167; // initial value of peripheral route strategy 3
// let w9c = 0.167; // initial value of peripheral route strategy 4
// let w10c = 0.167; // initial value of peripheral route strategy 5
// let w11c = 0.167; // initial value of peripheral route strategy 6
// let e1 = 1; // initial eligibility value
// let e2 = 1; // initial eligibility value
// let e3 = 1; // initial eligibility value
// let e4 = 1; // initial eligibility value
// let e5 = 1; // initial eligibility value
// let e6 = 1; // initial eligibility value
// let e7 = 1; // initial eligibility value
// let e8 = 1; // initial eligibility value
// let e9 = 1; // initial eligibility value
// let e10 = 1; // initial eligibility value
// let e11 = 1; // initial eligibility value

// data
parameters = {
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
};

strategies = {
  1: [
    "- Nice! When you exercise, your body moves. When it moves, it releases endorphins which are natural painkillers and mood elevators. Get excited and get moving!",

    "Great! Exercise helps you to fend off various ailments, such as heart attacks and depression. A person who exercises regularly is more likely to live a longer life. Let's get moving!",
  ],

  2: [
    "Only 10 minutes of exercise is enough to have a positive effect on brain function. Our proposed exercise is exactly 10 minutes. That means you will definitely feel much better after doing it. Let's go!",

    "Jason and Jenny do yoga once a week and they are some of the healthiest people you know. Exercising helps everyone to stay as fit as a fiddle. You should do it too!",
  ],

  3: [
    "Exercising doesn't have to be something fancy like running a marathon. For example, a simple brisk walk can also provide many health benefits such as increasing energy levels and preventing strokes. Let's get moving!",

    "Exercises can be done at home without additional equipment. For example, wall pushups can be done in the comfort of your house. Doing them improves your upper-body strength and is a simple exercise to do. Let's get going!",
  ],

  4: [
    "Exercise reduces your risk of major illness, including heart diseases, stroke, type 2 diabetes and cancer and lower your risk of early death by 30%. How powerful! Let's get up and get moving!",

    "89% of studies have shown that there is a statistically significant and positive association between physical activity and mental health. Less depression, more happiness. Let's go!",
  ],

  5: [
    "Exercising melts away stress and boosts your energy. It has proven to be a natural mood elevator. What are you waiting for? Let's go!",

    "Exercise is important when it comes to building and maintaining strong muscles and bones, all very important for older folks like yourself. Let's move!",
  ],

  6: [
    "Nice! When you exercise, your body moves. When it moves, it releases endorphins which are natural painkillIf you agree to exercise now, you'll be looking like a brand new person when you go down to grab your dinner later. Let's get moving!ers and mood elevators. Get excited and get moving!",

    "Do the exercise and this star is for you 🌟. Let's go!",
  ],

  7: [
    "The sun is shining and so are you. You look great today! Let's get those arms and legs moving to tone them up even further.",

    "Even though I'm a software, I work hard to understand you, even on days I feel bad. I'm sure you can do this exercise. Let's get moving!",
  ],

  8: [
    "Well, your friend Susan walks a lot. I think you are also capable of doing some gentle exercises. Let's get moving!",

    "As medical experts always say, exercise is the best medicine. Prevent ailments by exercising regularly. Let's go!",
  ],

  9: [
    "Remember that pledge you signed a few weeks ago on your commitment to exercising more regularly? Now is the time to take action. Let's get moving!",

    "Let's start with a simple walk today, nothing too complicated yet. I'm sure you can do it. Let's go!",
  ],

  10: [
    "Well, exercising acts as a stress reliever and ensures your body remains healthy under pressure. That's one of the reason why former prime minister and founding father Mr Lee Kuan Yew worked out every day unless there was severe lighting and thunder. Get excited and let's get moving!",

    "Well, you know, Queen Elizabeth II still does yoga at her age. She has a strict daily workout routine. She is 94 years old this year and still very healthy. Let's get moving!",
  ],

  11: [
    "Our exercise is specially curated in collaboration with Health Promotion Board (HPB). Let's do it together!",

    "Every week, we recommend a different type of exercise. Try it now before it's too late. Let's go!",
  ],
};

module.exports = {
  // choosingroute: function choosingroute(x_m) {
  //   y_c = x_m * w_cm;

  //   // peripheral route
  //   if (y_c <= 0.5) {
  //     let peripheralArrayOfActivationVector = peripheralGetActivationVector(
  //       w6c,
  //       w7c,
  //       w8c,
  //       w9c,
  //       w10c,
  //       w11c
  //     ); //store as array/list
  //     console.log(peripheralArrayOfActivationVector);
  //     let peripheralMaxActivationVector = Math.max(
  //       ...peripheralArrayOfActivationVector
  //     );
  //     console.log(peripheralMaxActivationVector);
  //     let strategyNumberChosen =
  //       peripheralArrayOfActivationVector.findIndex(
  //         (element) => (element = peripheralMaxActivationVector)
  //       ) + 1;
  //     var response = getStrategy(strategyNumberChosen); // cannot use let here because we need this variable outside of this function. has to be a global variable.
  //   }
  //   return response;
  // },

  choosingroute: function choosingroute(x_m) {
    // jsonReader("./parameters.json", (err, parameters) => {
    //   if (err) {
    //     console.log("Error reading file:", err);
    //     return;
    //   }
    // });
    console.log(parameters);

    parameters.y_c = x_m * 1; // y_c = x_m * w_cm

    // fs.writeFile("./parameters.json", JSON.stringify(parameters), (err) => {
    //   if (err) console.log("Error writing file:", err);
    // });

    // fs.readFile("./parameters.json", function (err, parameters) {
    //   fs.writeFile("./parameters.json", parameters, function (err, data) {
    //     if (err) console.log("error", err);
    //   });
    // });

    // y_c values. y_c = 0 means peripheral route is chosen. y_c = 1 means central route is chosen.
    if (parameters.y_c < 0.5) {
      parameters.y_c = 0;
      parameters.y_p = 1;
      candidateStrategiesWeights = parameters.strategyWeights.peripheral;
      candidateSelectedStrategies = parameters.selectedStrategies.peripheral;
    } else {
      parameters.y_c = 1;
      parameters.y_p = 0;
      candidateStrategiesWeights = parameters.strategyWeights.central;
      candidateSelectedStrategies = parameters.selectedStrategies.central;
    }
    // console.log(parameters);
    // return String(parameters.y_p);

    response = choosingStrategy(
      Math.max(parameters.y_c, parameters.y_p),
      candidateStrategiesWeights,
      candidateSelectedStrategies
    );

    return response;
    // peripheral route
    // if (y_c == 0) {
    //   let peripheralArrayOfActivationVector = peripheralGetActivationVector(
    //     w6c,
    //     w7c,
    //     w8c,
    //     w9c,
    //     w10c,
    //     w11c
    //   ); //store as array/list
    //   console.log(peripheralArrayOfActivationVector);
    //   let peripheralMaxActivationVector = Math.max(
    //     ...peripheralArrayOfActivationVector
    //   );
    //   console.log(peripheralMaxActivationVector);
    //   let strategyNumberChosen =
    //     peripheralArrayOfActivationVector.findIndex(
    //       (element) => (element = peripheralMaxActivationVector)
    //     ) + 1;
    //   var response = getStrategy(strategyNumberChosen); // cannot use let here because we need this variable outside of this function. has to be a global variable.
    // }
    // return response;
  },
};

// function peripheralGetActivationVector(w6c, w7c, w8c, w9c, w10c, w11c) {
//   activationVectors = [];
//   activationVectorsIndex = 0;
//   for (i in parameters.strategyWeights.peripheral) {
//     activationVectors[activationVectorsIndex] =
//       parameters.strategyWeights.peripheral[activationVectorsIndex] *
//       parameters.y_p *
//       parameters.selectedStrategies.peripheral[activationVectorsIndex];
//   }
//   return activationVectors;
// }

function getStrategy(strategyNumberChosen) {
  strategyResponse = strategies[strategyNumberChosen][1];
  console.log(strategyResponse);
  return strategyResponse;
}

function updateParameterValues(chosenStrategy) {}

function choosingStrategy(
  y_cORy_p,
  candidateStrategiesWeights,
  candidateSelectedStrategies
) {
  let activationVectors = [];
  let activationVectorsIndex = 0;
  for (i in candidateStrategiesWeights) {
    activationVectors[activationVectorsIndex] =
      candidateStrategiesWeights[activationVectorsIndex] *
      y_cORy_p *
      candidateSelectedStrategies[activationVectorsIndex];
  }

  console.log(activationVectors);
  let maxActivationVectors = Math.max(...activationVectors);
  console.log(maxActivationVectors);

  // strategyIndexChosen = index of strategy given the route already chosen. hence, if index 0 is chosen for peripheral route, it means strategy 6 has been selected. have to be var because we need it globally to know which strategy has been last chosen
  var strategyIndexChosen = activationVectors.findIndex(
    (element) => (element = maxActivationVectors)
  );
  console.log(strategyIndexChosen);

  // update ej (candidateSelectedStrategies)
  candidateSelectedStrategies[strategyIndexChosen] = 0;

  // if peripheral route was chosen
  if (parameters.y_p == 1) {
    parameters.selectedStrategies.peripheral = candidateSelectedStrategies;
    strategyIndexChosen = strategyIndexChosen + 5;
  } else {
    parameters.selectedStrategies.central = candidateSelectedStrategies;
  }

  var response = getStrategy(strategyIndexChosen + 1); // cannot use let here because we need this variable outside of this function. has to be a global variable.

  console.log(parameters.selectedStrategies);

  return response;
}
