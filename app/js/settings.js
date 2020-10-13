// ipcRenderer declared in monitor.js
const settingsForm = document.getElementById('settings-form');
const nav = document.getElementById('nav');

const cpuOverloadEl = document.getElementById('cpu-overload');
const alertFrequencyEl = document.getElementById('alert-frequency');

// Get settings
ipcRenderer.on('settings:get', (e, settings) => {
  cpuOverloadEl.value = settings.cpuOverload;
  document.getElementById('alert-frequency').value = settings.alertFrequency;
});

// Submit settings
settingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const cpuOverload = cpuOverloadEl.value;
  const alertFrequency = alertFrequencyEl.value;

  // Send new settings to main process
  ipcRenderer.send('settings:set', {
    cpuOverload,
    alertFrequency,
  });

  showAlert('Settings saved');
});

// Show alert for settings saved
function showAlert(msg) {
  const alert = document.getElementById('alert');
  alert.classList.remove('hide');
  alert.classList.add('alert');
  alert.innerText = msg;

  setTimeout(() => alert.classList.add('hide'), 3000);
}

// Toggle nav
ipcRenderer.on('nav:toggle', () => {
  nav.classList.toggle('hide');
});
