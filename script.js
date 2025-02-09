document.addEventListener("DOMContentLoaded", function () {
  // Boot up sequence: hide boot screen after 2 seconds
  setTimeout(() => {
    document.getElementById("bootScreen").style.display = "none";
  }, 2000);

  // Initialize draggable for each window
  const windows = document.querySelectorAll(".window");
  windows.forEach((win) => {
    dragElement(win);
  });

  // Load settings (theme) from cookies
  let theme = getCookie("theme");
  if (theme) {
    applyTheme(theme);
  }

  // Load note content from cookie if exists
  let note = getCookie("note");
  if (note) {
    document.getElementById("notesContent").value = decodeURIComponent(note);
  }

  // Load file manager data from cookie (files)
  loadFiles();
});

// Draggable windows function
function dragElement(elmnt) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  const titleBar = elmnt.querySelector(".title-bar");
  if (titleBar) {
    titleBar.onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // Bring window to front
    elmnt.style.zIndex = parseInt(Date.now() / 1000);
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Open and Close App windows
function openApp(id) {
  document.getElementById(id).style.display = "block";
}

function closeApp(id) {
  document.getElementById(id).style.display = "none";
}

// Notification function (shows for 3 seconds)
function showNotification(message) {
  const container = document.getElementById("notificationContainer");
  const notif = document.createElement("div");
  notif.className = "notification";
  notif.textContent = message;
  container.appendChild(notif);
  setTimeout(() => {
    notif.remove();
  }, 3000);
}

// Cookie utility functions
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(cname) == 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return "";
}

// Notes functions
function saveNote() {
  const note = document.getElementById("notesContent").value;
  setCookie("note", encodeURIComponent(note), 7);
  showNotification("Note saved!");
}

function deleteNote() {
  setCookie("note", "", -1);
  document.getElementById("notesContent").value = "";
  showNotification("Note deleted!");
}

// Calculator functions
function calcInput(val) {
  document.getElementById("calcDisplay").value += val;
}

function calcClear() {
  document.getElementById("calcDisplay").value = "";
}

function calcCalculate() {
  try {
    const result = eval(document.getElementById("calcDisplay").value);
    document.getElementById("calcDisplay").value = result;
  } catch (e) {
    document.getElementById("calcDisplay").value = "Error";
  }
}

// Terminal function
function terminalEnter(event) {
  if (event.key === "Enter") {
    const input = event.target.value;
    const output = document.getElementById("terminalOutput");
    const newLine = document.createElement("div");
    newLine.textContent = "> " + input;
    output.appendChild(newLine);
    event.target.value = "";
    output.scrollTop = output.scrollHeight;
  }
}

// Settings: Theme functions
function setTheme(theme) {
  setCookie("theme", theme, 30);
  applyTheme(theme);
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.style.background = "#333";
    document.body.style.color = "#fff";
  } else {
    document.body.style.background = "#e0e0e0";
    document.body.style.color = "#000";
  }
}

// File Manager functions
let files = [];
let currentFileIndex = -1;

function loadFiles() {
  const fileData = getCookie("files");
  if (fileData) {
    try {
      files = JSON.parse(fileData);
    } catch (e) {
      files = [];
    }
  }
  updateFileList();
}

function updateFileList() {
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";
  files.forEach((file, index) => {
    const li = document.createElement("li");
    li.textContent = file.name;
    li.onclick = () => {
      currentFileIndex = index;
      document.getElementById("fileContent").value = file.content;
    };
    fileList.appendChild(li);
  });
}

function createNewFile() {
  const fileName = prompt("Enter file name:");
  if (fileName) {
    files.push({ name: fileName, content: "" });
    currentFileIndex = files.length - 1;
    updateFileList();
    document.getElementById("fileContent").value = "";
    saveFiles();
    showNotification("New file created!");
  }
}

function saveFile() {
  if (currentFileIndex >= 0) {
    files[currentFileIndex].content = document.getElementById("fileContent").value;
    saveFiles();
    showNotification("File saved!");
  } else {
    showNotification("No file selected!");
  }
}

function deleteFile() {
  if (currentFileIndex >= 0) {
    if (confirm("Are you sure you want to delete this file?")) {
      files.splice(currentFileIndex, 1);
      currentFileIndex = -1;
      updateFileList();
      document.getElementById("fileContent").value = "";
      saveFiles();
      showNotification("File deleted!");
    }
  } else {
    showNotification("No file selected!");
  }
}

function saveFiles() {
  setCookie("files", JSON.stringify(files), 7);
}
