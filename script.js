document.addEventListener("DOMContentLoaded", function() {
  // Check for login credentials in localStorage
  if (!localStorage.getItem("username") || !localStorage.getItem("password")) {
    document.getElementById("loginScreen").style.display = "flex";
  } else {
    startOS();
  }
  // Initialize draggable windows
  initDraggableWindows();
  // Start clock update
  updateClock();
  setInterval(updateClock, 1000);
  // Load user profile (nav avatar, welcome message)
  loadUserProfile();
  // Load files for file manager
  loadFiles();
});

function initDraggableWindows() {
  const windows = document.querySelectorAll(".window");
  windows.forEach(win => {
    dragElement(win);
  });
}

// ----- DRAGGABLE WINDOW FUNCTIONALITY -----
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

// ----- CLOCK -----
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString();
}

// ----- LOGIN / REGISTRATION & PROFILE -----
function selectAvatar(src) {
  // Save selected avatar (temporary until registration or profile change)
  localStorage.setItem("selectedAvatar", src);
}

function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const storedUsername = localStorage.getItem("username");
  const storedPassword = localStorage.getItem("password");
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
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    // Save selected avatar or use default
    const avatar = localStorage.getItem("selectedAvatar") || "https://i.pinimg.com/736x/96/e4/82/96e48207b373600cea04807d51d20c4d.jpg";
    localStorage.setItem("avatar", avatar);
    localStorage.setItem("profileName", username);
    showNotification("Registration successful! Please login.");
  } else {
    showNotification("Please enter a username and password.");
  }
}

function loadUserProfile() {
  const username = localStorage.getItem("profileName") || localStorage.getItem("username") || "";
  document.getElementById("welcomeMsg").textContent = "Welcome, " + username;
  const avatar = localStorage.getItem("avatar") || "https://i.pinimg.com/736x/96/e4/82/96e48207b373600cea04807d51d20c4d.jpg";
  document.getElementById("navAvatar").src = avatar;
  document.getElementById("bootAvatar").src = avatar;
}

function saveProfile() {
  const profileName = document.getElementById("profileName").value;
  if (profileName) {
    localStorage.setItem("profileName", profileName);
    loadUserProfile();
    showNotification("Profile saved!");
  } else {
    showNotification("Please enter a display name.");
  }
}

// ----- BOOT / START OS -----
function startOS() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("bootScreen").style.display = "flex";
  setTimeout(() => {
    document.getElementById("bootScreen").style.display = "none";
    document.getElementById("mainOS").style.display = "block";
  }, 2000);
}

// ----- WINDOW MANAGEMENT -----
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

// ----- NOTIFICATIONS -----
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

// ----- THEME & WALLPAPER -----
function setTheme(theme) {
  localStorage.setItem("theme", theme);
  applyTheme(theme);
  showNotification("Theme set to " + theme);
}

function applyTheme(theme) {
  document.body.className = ""; // reset classes
  document.body.classList.add("theme-" + theme);
}

function changeWallpaper(wallpaper) {
  if (wallpaper === "default") {
    document.body.style.backgroundImage = "";
    localStorage.setItem("wallpaper", "default");
  } else {
    document.body.style.backgroundImage = "url('" + wallpaper + "')";
    localStorage.setItem("wallpaper", wallpaper);
  }
  showNotification("Wallpaper changed!");
}

function setLanguage(language) {
  localStorage.setItem("language", language);
  showNotification("Language set to " + language);
}

function toggleApp(appId, enabled) {
  const taskbarIcons = document.getElementById("taskbarIcons");
  const btn = taskbarIcons.querySelector("button[onclick*='" + appId + "']");
  if (btn) {
    btn.style.display = enabled ? "inline-block" : "none";
  }
}

// ----- FILE MANAGER -----
let files = [];
let currentFileIndex = -1;

function loadFiles() {
  const fileData = localStorage.getItem("files");
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
  localStorage.setItem("files", JSON.stringify(files));
}

// ----- CALCULATOR -----
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

// ----- TERMINAL -----
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

// ----- WEB BROWSER -----
function loadURL() {
  const url = document.getElementById("browserURL").value;
  const frame = document.getElementById("browserFrame");
  if (url) {
    frame.src = url;
  }
}

// ----- CAMERA APP -----
let cameraStream;
function startCamera() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(stream) {
        cameraStream = stream;
        const video = document.getElementById("cameraFeed");
        video.srcObject = stream;
        video.play();
      })
      .catch(function(err) {
        showNotification("Error accessing camera: " + err);
      });
  } else {
    showNotification("Camera not supported.");
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
}

// ----- TASK MANAGER -----
function updateTaskManager() {
  const runningApps = document.getElementById("runningApps");
  runningApps.innerHTML = "";
  const openWindows = document.querySelectorAll(".window");
  openWindows.forEach(win => {
    if (win.style.display !== "none") {
      const appName = win.id;
      const div = document.createElement("div");
      div.textContent = appName;
      runningApps.appendChild(div);
    }
  });
}
setInterval(updateTaskManager, 5000);
