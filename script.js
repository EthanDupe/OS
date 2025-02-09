document.addEventListener("DOMContentLoaded", function() {
  // If no username/password cookies exist, show login screen
  if (!getCookie("username") || !getCookie("password")) {
    document.getElementById("loginScreen").style.display = "flex";
  } else {
    startOS();
  }

  // Initialize draggable windows for all .window elements
  const windows = document.querySelectorAll(".window");
  windows.forEach(win => {
    dragElement(win);
  });

  // Load theme, wallpaper, language, and file manager data
  let theme = getCookie("theme");
  if (theme) {
    applyTheme(theme);
  }
  let wallpaper = getCookie("wallpaper");
  if (wallpaper && wallpaper !== "default") {
    document.body.style.backgroundImage = `url('${wallpaper}')`;
  }
  let language = getCookie("language");
  if (language) {
    console.log("Language set to:", language);
  }
  loadFiles();
});

// ----- OS Start / Boot Functions -----
function startOS() {
  // Hide login screen and show boot screen
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("bootScreen").style.display = "flex";
  setTimeout(() => {
    document.getElementById("bootScreen").style.display = "none";
  }, 2000);
}

// ----- Login & Registration -----
function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  let storedUsername = getCookie("username");
  let storedPassword = getCookie("password");
  if (!storedUsername || !storedPassword) {
    showNotification("No user registered. Please register.");
  } else if (username === storedUsername && password === storedPassword) {
    showNotification("Login successful!");
    startOS();
  } else {
    showNotification("Invalid credentials!");
  }
}

function registerUser() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  if (username && password) {
    setCookie("username", username, 30);
    setCookie("password", password, 30);
    showNotification("Registration successful! Please login.");
  } else {
    showNotification("Please enter a username and password.");
  }
}

// ----- Draggable Window Functionality -----
function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const titleBar = elmnt.querySelector(".title-bar");
  if (titleBar) {
    titleBar.onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    elmnt.style.zIndex = Date.now();
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
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// ----- Window Management Functions -----
function openApp(id) {
  document.getElementById(id).style.display = "block";
}

function closeApp(id) {
  document.getElementById(id).style.display = "none";
}

function minimizeWindow(id) {
  const win = document.getElementById(id);
  win.style.display = "none";
  const minimizedWindows = document.getElementById("minimizedWindows");
  const btn = document.createElement("button");
  btn.textContent = id;
  btn.id = "min_" + id;
  btn.onclick = function() {
    win.style.display = "block";
    btn.remove();
  };
  minimizedWindows.appendChild(btn);
}

function maximizeWindow(id) {
  const win = document.getElementById(id);
  if (!win.classList.contains("maximized")) {
    win.dataset.originalStyle = win.style.cssText;
    win.style.top = "0";
    win.style.left = "0";
    win.style.width = "100%";
    win.style.height = "100%";
    win.classList.add("maximized");
  } else {
    win.style.cssText = win.dataset.originalStyle;
    win.classList.remove("maximized");
  }
}

// ----- Notifications -----
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

// ----- Cookie Utility Functions -----
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days*24*60*60*1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(cname) === 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return "";
}

// ----- Notes App Functions -----
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

// ----- Calculator Functions -----
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

// ----- Terminal Functions -----
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

// ----- Settings & Customization Functions -----
function setTheme(theme) {
  setCookie("theme", theme, 30);
  applyTheme(theme);
  showNotification("Theme set to " + theme);
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

function changeWallpaper(wallpaper) {
  if (wallpaper === "default") {
    document.body.style.backgroundImage = "";
    setCookie("wallpaper", "default", 30);
  } else {
    document.body.style.backgroundImage = "url('" + wallpaper + "')";
    setCookie("wallpaper", wallpaper, 30);
  }
  showNotification("Wallpaper changed!");
}

function setLanguage(language) {
  setCookie("language", language, 30);
  showNotification("Language set to " + language);
}

function toggleApp(appId, enabled) {
  const taskbarIcons = document.getElementById("taskbarIcons");
  const btn = taskbarIcons.querySelector("button[onclick*='" + appId + "']");
  if (btn) {
    btn.style.display = enabled ? "inline-block" : "none";
  }
}

function changeAvatar(avatar) {
  setCookie("avatar", avatar, 30);
  showNotification("Avatar changed!");
}

function saveProfile() {
  const profileName = document.getElementById("profileName").value;
  setCookie("profileName", profileName, 30);
  showNotification("Profile saved!");
}

// ----- File Manager Functions -----
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
    li.onclick = function() {
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
