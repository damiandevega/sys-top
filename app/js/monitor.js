const path = require('path');
const osu = require('node-os-utils');
const { mem } = require('node-os-utils');
const cpu = osu.cpu;
const os = osu.os;

// Run every 2 seconds
setInterval(() => {
  // CPU Usage
  cpu.usage().then((info) => {
    document.getElementById('cpu-usage').innerText = `${info.toFixed(2)}%`;
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
const secondsToDhms = (seconds) => {
  seconds = +seconds;
  const day = Math.floor(seconds / (3600 * 24));
  const hour = Math.floor((seconds % (3600 * 24)) / 3600);
  const minute = Math.floor((seconds % 3600) / 60);
  const second = Math.floor(seconds % 60);

  return `${day}d, ${hour}h, ${minute}m, ${second}s`;
};
