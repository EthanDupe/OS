// Open the notes app when the "Notes" button is clicked
document.getElementById('notesButton').addEventListener('click', function() {
  openNotesApp();
});

// Display the notes app and load any saved note from cookies
function openNotesApp() {
  document.getElementById('notesApp').style.display = 'block';
  let note = getCookie('notes');
  if (note) {
    document.getElementById('notesContent').value = decodeURIComponent(note);
  }
}

// Close the notes app window
function closeNotesApp() {
  document.getElementById('notesApp').style.display = 'none';
}

// Save the note content to a cookie (expires in 7 days)
function saveNote() {
  let noteContent = document.getElementById('notesContent').value;
  setCookie('notes', encodeURIComponent(noteContent), 7);
  alert("Note saved!");
}

// Delete the note cookie and clear the textarea
function deleteNote() {
  setCookie('notes', '', -1); // Set cookie expiration to past date
  document.getElementById('notesContent').value = '';
  alert("Note deleted!");
}

// Utility function to set a cookie
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

// Utility function to get a cookie by name
function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
