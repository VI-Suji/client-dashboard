const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const pool = require('./db');

const devices = [
  "192.168.1.247",
  "192.168.1.248",
  "192.168.1.249",
  "192.168.1.250",
  "192.168.10.8",
  "192.168.10.9",
  "192.168.10.10",
  "192.168.10.11",
  "192.168.10.12",
  "192.168.10.13",
  "192.168.10.14",
  "192.168.10.15",
  "192.168.10.64",
  "192.168.10.54",
  "192.168.1.201",
  "192.168.1.202",
  "192.168.1.203",
  "192.168.1.204",
];

const filePath = "data.json";

const loadData = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM devices');
    return rows;
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
};

const saveData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
};

const timeString = (originalDateString) => {
  var originalDate = new Date(originalDateString);

  // Extract date components
  var year = originalDate.getFullYear();
  var month = originalDate.getMonth() + 1; // Months are zero-indexed
  var day = originalDate.getDate();
  var hours = originalDate.getHours();
  var minutes = originalDate.getMinutes();
  var seconds = originalDate.getSeconds();
  
  // Convert hours to 24-hour format if needed
  if (originalDateString.includes('pm') && hours < 12) {
      hours += 12;
  }
  
  // Pad single-digit values with leading zeros
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  
  // Construct the formatted date string
  var formattedDateString = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
  
  return formattedDateString;
};

const countCsvRows = (fileName) => {
  const fileData = fs.readFileSync(fileName, "utf8");
  const rowCount = fileData.trim().split("\n").length;
  return rowCount;
};

const writeCsv = (fileName, data) => {
  fs.appendFileSync(fileName, data.join(",") + "\n");
};

const createMonthlyCsv = (fileName) => {
  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(
      fileName,
      "Sl No,Device Name,Downtime Started,Downtime Ended,Duration,Location,Reason\n"
    );
  }
};

const checkDeviceStatus = async (device) => {
  // let found = false;
  const data = await loadData();
  // console.log(data.length);

  // for (const d of data) {
  //   if (d.device_ip === device) {
  //     found = true;
  //     break;
  //   }
  // }

  // if (!found) {
  //   await pool.query('INSERT INTO devices (device_ip, color, time, state) VALUES ($1, $2, $3, $4)', [device, "green", "", "Online"]);
  // }

  exec(`ping -c 1 ${device}`, (error, stdout) => {
    const now = new Date().toLocaleString();
    const timeNow = new Date().toLocaleString();
    // console.log(stdout,!stdout.includes("100% packet loss"));
    // console.log(data);

    if (!stdout.includes("100% packet loss")) {
      checkUpdateOnline(device, new Date(), data);
    } else {
      checkUpdateOffline(device, timeNow, data);
    }

    saveData(data);
  });
};

const checkUpdateOffline = async (device, timeNow, data) => {
  try {
    const client = await pool.connect();

    for (const d of data) {
      if (d.device_ip === device && d.color === 'red') {
        continue;
      } else if (d.device_ip === device) {
        console.log('time for red is ',timeNow,timeString(timeNow));
        await client.query('UPDATE devices SET color = $1, time = $2, state = $3 WHERE device_ip = $4', ['red', timeString(timeNow), 'Offline', device]);
        d.color = 'red';
        d.time = timeString(timeNow);
        d.state = 'Offline';
      }
    }

    client.release();

    return data;
  } catch (error) {
    console.error('Error updating device status:', error);
    throw error;
  }
};

const checkUpdateOnline = async (device, time, data) => {
  try {
    // console.log("Data is",data.length);
    for (const d of data) {
      if (d.device_ip === device) {
        if (d.state === 'Offline') {
          const currentDate = new Date();
          const formattedDate = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

          const timeDiff = currentDate - new Date(d.time);

          const hours = timeDiff / (1000 * 60 * 60);
          const shouldWriteCsv = true;
          
          if (shouldWriteCsv) {
            const formattedTimeDiff = `${hours}`;
            const monthFileName = path.join(
              'files',
              currentDate.toLocaleString('default', { month: 'long' })
            ) + '.csv';
            
            createMonthlyCsv(monthFileName);
            writeCsv(monthFileName, [
              countCsvRows(monthFileName),
              d.title,
              d.time,
              currentDate.toLocaleString(),
              formattedTimeDiff,
              d.description,
              'Power Outage',
              d.id
            ]);

          const { rows } = await pool.query('SELECT COUNT(*) FROM status WHERE device_id = $1 AND downtime_started = $2',[d.id,d.time]);
          console.log("A is ",rows[0].count,d.time,timeString(d.time),timeString(formattedDate));
          if(rows[0].count==0){await pool.query('INSERT INTO status (device_name, downtime_started, downtime_ended, duration, location, reason, device_id) VALUES ($1, $2, $3, $4, $5, $6, $7)', [d.title, d.time, timeString(formattedDate), formattedTimeDiff, d.description, 'Power Outage', d.id]);}
          }
          
          const client = await pool.connect();
          await client.query('UPDATE devices SET color = $1, time = $2, state = $3 WHERE device_ip = $4', ['green', '', 'Online', device]);
          client.release();

          d.color = 'green';
          d.time = '';
          d.state = 'Online';
        }
        break;
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error updating device status:', error);
    throw error;
  }
};

const ipInvoke = () => {
  setInterval(() => {
    devices.forEach((device) => {
      checkDeviceStatus(device);
    });
  }, 10000);
};

module.exports = ipInvoke;
