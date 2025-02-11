document.addEventListener("DOMContentLoaded", function() {
  if (!localStorage.getItem("username") || !localStorage.getItem("password")) {
    document.getElementById("loginScreen").style.display = "flex";
  } else {
    startOS();
  }
  initDraggableWindows();
  updateClock();
  setInterval(updateClock, 1000);
  loadUserProfile();
  loadFiles();
  loadTodos();
  initPaint();
  // Apply saved theme and wallpaper (if any)
  let savedTheme = localStorage.getItem("theme");
  if (savedTheme) applyTheme(savedTheme);
  let savedWallpaper = localStorage.getItem("wallpaper");
  if (savedWallpaper && savedWallpaper !== "default") {
    document.body.style.backgroundImage = "url('" + savedWallpaper + "')";
  }
});

// ---------- DRAGGABLE WINDOWS ----------
function initDraggableWindows() {
  const wins = document.querySelectorAll(".window");
  wins.forEach(win => dragElement(win));
}
function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const titleBar = elmnt.querySelector(".title-bar");
  if (titleBar) titleBar.onmousedown = dragMouseDown;
  else elmnt.onmousedown = dragMouseDown;
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

// ---------- CLOCK & WELCOME ----------
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString();
}
function loadUserProfile() {
  let uname = localStorage.getItem("username") || "User";
  document.getElementById("welcomeMsg").textContent = "Welcome, " + uname;
  let avatar = localStorage.getItem("avatar") ||
    "https://i.pinimg.com/736x/53/7c/8a/537c8a75f01598eb7559552f4c4b0dc7.jpg";
  document.getElementById("navAvatar").src = avatar;
  document.getElementById("bootAvatar").src = avatar;
}

// ---------- LOGIN & REGISTRATION ----------
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
    // Set default avatar and profile name (no avatar selection on signup)
    localStorage.setItem("avatar", "https://i.pinimg.com/736x/53/7c/8a/537c8a75f01598eb7559552f4c4b0dc7.jpg");
    localStorage.setItem("profileName", username);
    showNotification("Registration successful! Please login.");
  } else {
    showNotification("Please enter a username and password.");
  }
}

// ---------- BOOT & START OS ----------
function startOS() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("bootScreen").style.display = "flex";
  setTimeout(() => {
    document.getElementById("bootScreen").style.display = "none";
    document.getElementById("mainOS").style.display = "block";
  }, 2000);
}

// ---------- WINDOW MANAGEMENT ----------
function openApp(id) {
  document.getElementById(id).style.display = "block";
  // For calendar app, render calendar when opened
  if (id === "calendarApp") renderCalendar();
}
function closeApp(id) {
  document.getElementById(id).style.display = "none";
}
function minimizeWindow(id) {
  const win = document.getElementById(id);
  win.style.display = "none";
  const minBar = document.getElementById("minimizedWindows");
  const btn = document.createElement("button");
  btn.textContent = id;
  btn.id = "min_" + id;
  btn.onclick = () => { win.style.display = "block"; btn.remove(); };
  minBar.appendChild(btn);
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

// ---------- NOTIFICATIONS ----------
function showNotification(message) {
  const container = document.getElementById("notificationContainer");
  const notif = document.createElement("div");
  notif.className = "notification";
  notif.textContent = message;
  container.appendChild(notif);
  setTimeout(() => { notif.remove(); }, 3000);
}

// ---------- THEME & WALLPAPER ----------
function setTheme(theme) {
  localStorage.setItem("theme", theme);
  applyTheme(theme);
  showNotification("Theme set to " + theme);
}
function applyTheme(theme) {
  document.body.className = "";
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
  const btn = document.querySelector("#taskbarIcons button[onclick*='" + appId + "']");
  if (btn) btn.style.display = enabled ? "inline-block" : "none";
}

// ---------- PROFILE (in Settings) ----------
function selectAvatarFromSettings(src) {
  localStorage.setItem("avatar", src);
  loadUserProfile();
  showNotification("Profile picture updated!");
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

// ---------- FILE MANAGER ----------
let files = [];
let currentFileIndex = -1;
function loadFiles() {
  const fileData = localStorage.getItem("files");
  if (fileData) {
    try { files = JSON.parse(fileData); }
    catch (e) { files = []; }
  }
  updateFileList();
}
function updateFileList() {
  const list = document.getElementById("fileList");
  list.innerHTML = "";
  files.forEach((file, i) => {
    const li = document.createElement("li");
    li.textContent = file.name;
    li.onclick = () => {
      currentFileIndex = i;
      document.getElementById("fileContent").value = file.content;
    };
    list.appendChild(li);
  });
}
function createNewFile() {
  const name = prompt("Enter file name:");
  if (name) {
    files.push({ name: name, content: "" });
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
function importNotes() {
  const noteText = document.getElementById("notesContent").value;
  if (noteText) {
    files.push({ name: "Imported Note", content: noteText });
    saveFiles();
    updateFileList();
    showNotification("Notes imported to Files!");
  } else {
    showNotification("No note content to import.");
  }
}

function saveNote() {
  const note = document.getElementById("notesContent").value;
  localStorage.setItem("note", encodeURIComponent(note));
  showNotification("Note saved!");
}
function deleteNote() {
  localStorage.removeItem("note");
  document.getElementById("notesContent").value = "";
  showNotification("Note deleted!");
}

// ---------- CALCULATOR ----------
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

// ---------- TERMINAL (supports up to 100 responses) ----------
function terminalEnter(event) {
  if (event.key === "Enter") {
    const inputField = document.getElementById("terminalInput");
    const input = inputField.value;
    const out = document.getElementById("terminalOutput");
    const line = document.createElement("div");
    line.textContent = "> " + input;
    out.appendChild(line);
    inputField.value = "";
    // Keep only the latest 100 responses
    while (out.children.length > 100) {
      out.removeChild(out.firstChild);
    }
    out.scrollTop = out.scrollHeight;
  }
}

// ---------- WEB BROWSER ----------
function loadURL() {
  const url = document.getElementById("browserURL").value;
  if (url) document.getElementById("browserFrame").src = url;
}

// ---------- MEDIA PLAYER ----------
function loadMusic() {
  const url = document.getElementById("musicURL").value;
  if (url) {
    const audio = document.getElementById("audioPlayer");
    audio.src = url;
    audio.load();
    showNotification("Music loaded!");
  }
}

// ---------- CAMERA APP ----------
let cameraStream;
function startCamera() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        cameraStream = stream;
        const video = document.getElementById("cameraFeed");
        video.srcObject = stream;
        video.play();
      })
      .catch(err => showNotification("Camera error: " + err));
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

// ---------- GAMES APP (Tic Tac Toe) ----------
let tttBoard = Array(9).fill("");
let currentPlayer = "X";
function makeMove(index) {
  if (tttBoard[index] === "" && !checkWinner()) {
    tttBoard[index] = currentPlayer;
    updateTttBoard();
    if (checkWinner()) {
      document.getElementById("gameStatus").textContent = "Player " + currentPlayer + " wins!";
      showNotification("Player " + currentPlayer + " wins!");
    } else if (tttBoard.every(cell => cell !== "")) {
      document.getElementById("gameStatus").textContent = "Draw!";
      showNotification("Game drawn!");
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      document.getElementById("gameStatus").textContent = "Current Player: " + currentPlayer;
    }
  }
}
function updateTttBoard() {
  const cells = document.querySelectorAll("#ticTacToeBoard .cell");
  cells.forEach((cell, index) => {
    cell.textContent = tttBoard[index];
  });
}
function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(combo => combo.every(i => tttBoard[i] === currentPlayer));
}
function resetGame() {
  tttBoard = Array(9).fill("");
  currentPlayer = "X";
  updateTttBoard();
  document.getElementById("gameStatus").textContent = "Current Player: " + currentPlayer;
}

// ---------- CALENDAR APP (Functional) ----------
function renderCalendar() {
  const calendarEl = document.getElementById("calendarContent");
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let html = `<h3>${now.toLocaleString('default', { month: 'long' })} ${year}</h3>`;
  html += `<table class="calendar-table"><thead><tr>
             <th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th>
           </tr></thead><tbody><tr>`;
  for (let i = 0; i < firstDay; i++) {
    html += "<td></td>";
  }
  for (let day = 1; day <= daysInMonth; day++) {
    if ((firstDay + day - 1) % 7 === 0 && day !== 1) {
      html += "</tr><tr>";
    }
    html += `<td>${day}</td>`;
  }
  html += "</tr></tbody></table>";
  calendarEl.innerHTML = html;
}

// ---------- TASK MANAGER ----------
function updateTaskManager() {
  const mgr = document.getElementById("runningApps");
  mgr.innerHTML = "";
  const openWins = document.querySelectorAll(".window");
  openWins.forEach(win => {
    if (win.style.display !== "none") {
      const div = document.createElement("div");
      div.textContent = win.id;
      mgr.appendChild(div);
    }
  });
}
setInterval(updateTaskManager, 5000);

// ---------- TO-DO APP ----------
let todos = [];
function loadTodos() {
  const data = localStorage.getItem("todos");
  if (data) {
    try { todos = JSON.parse(data); }
    catch(e) { todos = []; }
  }
  updateTodoList();
}
function updateTodoList() {
  const list = document.getElementById("todoList");
  list.innerHTML = "";
  todos.forEach((t, i) => {
    const li = document.createElement("li");
    li.textContent = t;
    li.onclick = () => {
      if (confirm("Remove this task?")) { todos.splice(i, 1); saveTodos(); }
    };
    list.appendChild(li);
  });
}
function addTodo() {
  const task = document.getElementById("todoInput").value;
  if (task) {
    todos.push(task);
    document.getElementById("todoInput").value = "";
    saveTodos();
    updateTodoList();
    showNotification("Task added!");
  }
}
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ---------- PAINT APP ----------
let canvas, ctx, painting = false;
function initPaint() {
  canvas = document.getElementById("paintCanvas");
  if (canvas) {
    ctx = canvas.getContext("2d");
    canvas.addEventListener("mousedown", () => { painting = true; });
    canvas.addEventListener("mouseup", () => { painting = false; ctx.beginPath(); });
    canvas.addEventListener("mousemove", draw);
  }
}
function draw(e) {
  if (!painting) return;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
