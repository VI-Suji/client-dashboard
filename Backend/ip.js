const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const devices = [
    "192.168.1.1", "192.168.1.2", "192.168.1.3", "192.168.1.4", "192.168.1.5",
    "192.168.1.6", "192.168.1.7", "192.168.1.8", "192.168.1.9", "192.168.1.10",
    "192.168.1.11", "192.168.1.12", "192.168.1.13", "192.168.1.14", "192.168.1.15",
    "192.168.1.16", "192.168.1.17", "192.168.1.18"
];

const filePath = "data.json";

const loadData = (filePath) => {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (err) {
    return [];
  }
};

const saveData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
};

const countCsvRows = (fileName) => {
  const fileData = fs.readFileSync(fileName, 'utf8');
  const rowCount = fileData.trim().split('\n').length;
  return rowCount;
};

const writeCsv = (fileName, data) => {
  fs.appendFileSync(fileName, data.join(',') + '\n');
};

const createMonthlyCsv = (fileName) => {
  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, 'Sl No,Device IP,Downtime Started,Downtime Ended,Duration\n');
  }
};

const checkDeviceStatus = (device) => {
  let found = false;

  for (const d of data) {
    if (d.device_ip === device) {
      found = true;
      break;
    }
  }

  if (!found) {
    data.push({ device_ip: device, color: 'green', time: '', state: 'Online' });
  }
  exec(`ping -c 1 ${device}`, (error, stdout) => {
    const now = new Date().toLocaleString();
    const timeNow = new Date().toLocaleString();

    if (!stdout.includes('100.0% packet loss')) {
      checkUpdateOnline(device, new Date());
    } else {
      checkUpdateOffline(device, timeNow, data);
    }

    saveData(filePath, data);
  });
};

const checkUpdateOffline = (device, timeNow, data) => {
  for (const d of data) {
    if (d.device_ip === device && d.color === 'red') {
      continue;
    } else if (d.device_ip === device) {
      d.color = "red";
      d.time = timeNow;
      d.state = 'Offline';
    }
  }
  return data;
};

const checkUpdateOnline = (device, time) => {
  for (const d of data) {
    if (d.device_ip === device) {
      if (d.state === "Offline") {
        const currentDate = new Date();
        const timeDiff = currentDate - new Date(d.time);
        const weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
        const days = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const formattedTimeDiff = `${weeks} week(s) ${days} day(s) ${hours} hour(s) ${minutes} minute(s)`;
        const monthFileName = path.join('files', currentDate.toLocaleString('default', { month: 'long' })) + '.csv';
        // const shouldWriteCsv = weeks > 0 || days > 0 || hours > 0 || minutes > 10;
        createMonthlyCsv(monthFileName);
        writeCsv(monthFileName, [countCsvRows(monthFileName), d.device_ip, d.time, currentDate.toLocaleString(), formattedTimeDiff]);
      }
      d.color = "green";
      d.time = '';
      d.state = 'Online';
    }
  }
  return data;
};

let data;

function ip_invoke(){
    setInterval(() => {
    data = loadData(filePath);
    devices.forEach((device) => {
        checkDeviceStatus(device);
    });
    }, 5000);
}

module.exports = {
    ipInvoke : ip_invoke
}
