const path = require('path');
const { ipcRenderer } = require('electron');
const osu = require('node-os-utils');
const { mem } = require('node-os-utils');
const cpu = osu.cpu;
const os = osu.os;

let cpuOverload; // in percentage
let alertFrequency; // in minutes

// Get settings and values
ipcRenderer.on('settings:get', (e, settings) => {
  cpuOverload = +settings.cpuOverload;
  alertFrequency = +settings.alertFrequency;
});

// Run every 2 seconds
setInterval(() => {
  // CPU Usage
  cpu.usage().then((info) => {
    document.getElementById('cpu-usage').innerText = `${info.toFixed(2)}%`;
    document.getElementById('cpu-progress').style.width = `${info}%`;

    // Make progress bar red if overload
    if (info >= cpuOverload) {
      document.getElementById('cpu-progress').style.background = `red`;
    } else {
      document.getElementById('cpu-progress').style.background = `#30c88b`;
    }

    // Check overload
    if (info >= cpuOverload && runNotify(alertFrequency)) {
      notifyUser({
        title: 'CPU Overload',
        body: `CPU is over ${cpuOverload}%`,
        icon: path.join(__dirname, 'img', 'icon.png'),
      });

      localStorage.setItem('lastNotify', +new Date());
    }
  });

  // CPU Free
  cpu.free().then((info) => {
    document.getElementById('cpu-free').innerText = `${info.toFixed(2)}%`;
  });

  // Uptime
  document.getElementById('sys-uptime').innerText = secondsToDhms(os.uptime());
}, 2000);

// Set Model
document.getElementById('cpu-model').innerText = cpu.model();

// Computer Name
document.getElementById('comp-name').innerText = os.hostname();

// Operating System
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`;

// Total Memory
mem.info().then((info) => {
  document.getElementById('mem-total').innerText = `${info.totalMemMb} MB`;
});

// Show days, hours, minutes and seconds
function secondsToDhms(seconds) {
  seconds = +seconds;
  const day = Math.floor(seconds / (3600 * 24));
  const hour = Math.floor((seconds % (3600 * 24)) / 3600);
  const minute = Math.floor((seconds % 3600) / 60);
  const second = Math.floor(seconds % 60);

  return `${day}d, ${hour}h, ${minute}m, ${second}s`;
}

// Send notification
function notifyUser(options) {
  new Notification(options.title, options);
}

// Check how much time has passed since notification
function runNotify(frequency) {
  if (!localStorage.getItem('lastNotify')) {
    // Store timestamp
    localStorage.setItem('lastNotify', +new Date());
    return true;
  }
  const notifyTime = new Date(parseInt(localStorage.getItem('lastNotify')));
  const now = new Date();
  const diffTime = Math.abs(now - notifyTime);
  const minutesPassed = Math.ceil(diffTime / (1000 * 60));

  if (minutesPassed > frequency) {
    return true;
  } else {
    return false;
  }
}
