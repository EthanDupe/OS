// Open an app
function openApp(id) {
    document.getElementById(id).style.display = 'block';
}

// Close an app
function closeApp(id) {
    document.getElementById(id).style.display = 'none';
}

// Notes App Functions
function saveNote() {
    let note = document.getElementById("notesContent").value;
    document.cookie = `note=${encodeURIComponent(note)}; path=/`;
}

function deleteNote() {
    document.cookie = "note=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.getElementById("notesContent").value = "";
}

// Load Note from Cookies
window.onload = function() {
    let cookies = document.cookie.split("; ");
    cookies.forEach(cookie => {
        let [name, value] = cookie.split("=");
        if (name === "note") document.getElementById("notesContent").value = decodeURIComponent(value);
    });
}

// Calculator Functions
function calcInput(val) {
    document.getElementById("calcDisplay").value += val;
}

function calcClear() {
    document.getElementById("calcDisplay").value = "";
}

function calcCalculate() {
    document.getElementById("calcDisplay").value = eval(document.getElementById("calcDisplay").value);
}

// Terminal Commands
function terminalEnter(event) {
    if (event.key === "Enter") {
        let input = event.target.value;
        let output = document.getElementById("terminalOutput");
        output.innerHTML += `<div>> ${input}</div>`;
        event.target.value = "";
    }
}

// Theme Settings
function setTheme(theme) {
    document.cookie = `theme=${theme}; path=/`;
    document.body.style.background = theme === "dark" ? "#222" : "#fff";
}
