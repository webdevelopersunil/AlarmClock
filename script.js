//Initial References for components
let timerRef = document.querySelector(".timer-display");
const activeAlarms = document.querySelector(".activeAlarms");
const hourInput = document.getElementById("hourInput");
const setAlarm = document.getElementById("set");
const minuteInput = document.getElementById("minuteInput");
const clearInputButton = document.getElementById("clear-input");

const maxHours = 23;
const maxMinutes = 59;
let alarmsArray = [];
let alarmSound = new Audio("./audio.wav");

let initialHour = 0,
  initialMinute = 0,
  alarmIndex = 0;

//Append zeroes for single digit
const appendZero = (value) => (value < 10 ? "0" + value : value);


//Display Time
function displayTimer() {
  let date = new Date();
  let [hours, minutes, seconds] = [
    appendZero(date.getHours()),
    appendZero(date.getMinutes()),
    appendZero(date.getSeconds()),
  ];

  //Display the time
  timerRef.innerHTML = `${hours}:${minutes}:${seconds}`;
  
  //Fetching alarm arrays for matching with current time.
alarmsArray.forEach((alarm, index) => {
  if (alarm.isActive) {
    if (`${alarm.alarmHour}:${alarm.alarmMinute}` === `${hours}:${minutes}`) {
      alarmSound.play();
      alarmSound.loop = true;

      // Stop the alarm after 2 minutes
      setTimeout(() => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        alarmSound.loop = false;
      }, 120000);
    }
  }
});



}

const inputCheck = (inputValue) => {
  inputValue = parseInt(inputValue);

  if (inputValue < 10) {
    inputValue = appendZero(inputValue);
  }
  return inputValue;
};

hourInput.addEventListener("input", () => {
  
  inputCheck(hourInput.value) > 23 ? hourInput.value = maxHours : hourInput.value = inputCheck(hourInput.value) ;
  
});

minuteInput.addEventListener("input", () => {

  inputCheck(minuteInput.value) > 59 ? minuteInput.value = maxMinutes : minuteInput.value = inputCheck(minuteInput.value) ;
  // minuteInput.value = inputCheck(minuteInput.value);
});



//Create alarm div
const createAlarm = (alarmObj) => {

  //Keys from object
  const { id, alarmHour, alarmMinute } = alarmObj;
  //Alarm div
  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}: ${alarmMinute}</span>`;

  //checkbox
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  alarmDiv.appendChild(checkbox);

  //Delete button
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);
  activeAlarms.appendChild(alarmDiv);
};



//Set Alarm
setAlarm.addEventListener("click", () => {
  alarmIndex += 1;

  // alarmObject
  let alarmObj = {};

  alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}`;
  alarmObj.alarmHour = hourInput.value;
  alarmObj.alarmMinute = minuteInput.value;
  // console.log(alarmObj);

  alarmObj.isActive = true;

  // Check if alarmObj.id is present in alarmsArray
  const isPresent = alarmsArray.some((item) => item.alarmHour === alarmObj.alarmHour && item.alarmMinute === alarmObj.alarmMinute );

  if (isPresent) {
    alert(`Alarm with same time already exists.`);
    return;
  }else{

    alarmsArray.push(alarmObj);
    createAlarm(alarmObj);
    hourInput.value = appendZero(initialHour);
    minuteInput.value = appendZero(initialMinute);

  }
});

//delete alarm
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmSound.pause();
    e.target.parentElement.parentElement.remove();
    alarmsArray.splice(index, 1);
  }
};

window.onload = () => {
  setInterval(displayTimer);
  initialHour = 0;
  initialMinute = 0;
  alarmIndex = 0;
  alarmsArray = [];
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
};


//Search for value in object
const searchObject = (parameter, value) => {
  let alarmObject,
    objIndex,
    exists = false;
  alarmsArray.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObject, objIndex];
};

clearInputButton.addEventListener("click", () => {
  hourInput.value = "00";
  minuteInput.value = "00";
});