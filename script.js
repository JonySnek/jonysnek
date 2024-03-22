// init
let level = 0;
const keyTable = ["w", "e", "s", "d"];
let lastKey = "";
let inputStream = [];
let simonIDs = [];
let simonKeys = [];
//let timeouts = [];

//✅ sync timeout (pasue code)
let sleep = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

//✅ gameover feedback & reset
let deathScreen = () => {
  new Audio("./src/sounds/wrong.mp3").play();
  $("body").addClass("game-over");
  setTimeout(() => {
    $("body").removeClass("game-over");
  }, 150);

  level = 0;
  lastKey = "";
  inputStream = [];
  simonIDs = [];
  simonKeys = [];

  $("h1#level-title").html(
    'Press <span id="start-button">Space</span> to Start'
  );
};

//✅ next rnd num & show it
function levelHandler(level) {
  /* timeouts.forEach((id) => {
    clearTimeout(id);
  }); */

  //simonIDs = [];
  //simonKeys = [];
  let rnd = ~~(Math.random() * 4);
  simonIDs.push(rnd);
  simonKeys.push(keyTable[rnd]);

  inputStream = [];
  /* for (let i = 0; i < level; i++) {
    
    //await sleep(1000); //(for async function only)

    //console.log(simonsButtonID);
  } */
  setTimeout(() => {
    keydownFeedback($("div.btn")[simonIDs.at(-1)]);
  }, 500);
}

//✅ initiates level, handles visuals
let start = () => {
  level = 1;
  $("h1#level-title").text("Level " + level);

  levelHandler(level);
};

//✅ highlights pressed button
let keydownFeedback = (targetObj) => {
  targetObj.classList.add("pressed");
  setTimeout(() => {
    targetObj.classList.remove("pressed");
  }, 80);
  new Audio("./src/sounds/" + targetObj.classList[2] + ".mp3").play();
};

//✅ checks solution & advances level
let inputHandler = (event, targeted = false) => {
  let key;
  let element;

  if (targeted) {
    key = event.target.classList[0];
    element = event.target;
  } else {
    key = event.key;
    $.each($(".btn"), (index, button) => {
      button.classList[0] === key ? (element = button) : {};
    });
  }
  inputStream.push(key);
  keydownFeedback(element);

  //check for valid solution
  for (let i = 0; i < inputStream.length; i++) {
    if (simonKeys[i] != inputStream[i]) {
      deathScreen();
      break;
    }
  }

  //next lvl
  if (simonKeys.length === inputStream.length && level != 0) {
    level++;
    $("h1#level-title").text("Level " + level);

    levelHandler(level);
  }
};

//✅ on click: handles input
$("div.btn").click((event) => {
  inputHandler(event, true);
});

// ❌ depricated jquery for tap I think
$("div.btn").on("tap", (event) => {
  inputHandler(event, true);
});

//✅ on keydown: starts level OR handles input
$(document).keydown((event) => {
  //lastKey = event.key;
  //console.log(lastKey);
  if (event.key === " ") {
    start();
    event.preventDefault();
  } else if (
    event.key === "w" ||
    event.key === "e" ||
    event.key === "s" ||
    event.key === "d"
  ) {
    inputHandler(event, false);
  }
});

$('span[type="button"]').click(() => {
  start();
});

$('span[type="button"]').on("tap", () => {
  start();
});
