const pool = require('./db');

// Function to create tables
async function createTables() {
    try {
      // Connect to the database
      const client = await pool.connect();
  
      // Create devices table
      await client.query(`
        CREATE TABLE IF NOT EXISTS devices (
          id SERIAL PRIMARY KEY,
          device_ip VARCHAR(15) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255),
          image_url VARCHAR(255),
          color VARCHAR(50),
          state VARCHAR(50),
          time VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
  
      // Create status table
      await client.query(`
        CREATE TABLE IF NOT EXISTS status (
          id SERIAL PRIMARY KEY,
          device_name VARCHAR(255) NOT NULL,
          downtime_started TIMESTAMP,
          downtime_ended TIMESTAMP,
          duration FLOAT,
          location VARCHAR(255),
          reason VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          device_id INT REFERENCES devices(id) ON DELETE CASCADE
        )
      `);
  
      // Release the client back to the pool
      client.release();
  
      console.log('Tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
    }
  }
  
  // Data set to be seeded into the devices table
  const devicesData = [
    {
        "device_ip": "192.168.1.247",
        "title": "Vijayamangalam CCTV",
        "description": "Vijayamangalam Highway",
        "imageUrl": "/customers/images/cctv.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.1.248",
        "title": "Punjabi Dhabha CCTV",
        "description": "Opp: Punjabi Dhabha",
        "imageUrl": "/customers/images/cctv.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.1.249",
        "title": "Laxmi Nagar CCTV",
        "description": "Laxmi Nagar",
        "imageUrl": "/customers/images/cctv.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.1.250",
        "title": "Kumarapalayam CCTV",
        "description": "Kumarapalayam",
        "imageUrl": "/customers/images/cctv.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.10.8",
        "title": "Chengapalli Transmitter",
        "description": "Chengapalli",
        "imageUrl": "/customers/images/tx.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.10.9",
        "title": "KTL RX",
        "description": "KTL",
        "imageUrl": "/customers/images/rx.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.10.10",
        "title": "KTL Transmitter",
        "description": "KTL",
        "imageUrl": "/customers/images/tx.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.10.11",
        "title": "Punjabi Dhabha Reciever",
        "description": "Punjabi Dhabha",
        "imageUrl": "/customers/images/rx.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.10.12",
        "title": "Punjabi Dhaba Transmitter",
        "description": "Punjabi Dhabha",
        "imageUrl": "/customers/images/tx.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.10.13",
        "title": "Thiruvachi Reciever ",
        "description": "Thiruvachi",
        "imageUrl": "/customers/images/rx.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.10.14",
        "title": "Thiruvachi TX",
        "description": "Thiruvachi",
        "imageUrl": "/customers/images/tx.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.10.15",
        "title": "Opp: Water Tank Receiver",
        "description": "Opp: Water Tank",
        "imageUrl": "/customers/images/rx.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.10.64",
        "title": "Dual VMS Receiver",
        "description": "Dual VMS RX",
        "imageUrl": "/customers/images/rx.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.10.54",
        "title": "Dual VMS Transmitter",
        "description": "Dual VMS TX",
        "imageUrl": "/customers/images/tx.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.1.201",
        "title": "Chengapally VMS",
        "description": "Chengapally",
        "imageUrl": "/customers/images/vms.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.1.202",
        "title": "Thiruvachi VMS",
        "description": "Thiruvachi",
        "imageUrl": "/customers/images/vms.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.1.203",
        "title": "Thiruvachi VMS",
        "description": "Thiruvachi",
        "imageUrl": "/customers/images/vms.png",
        "color": "green",
        "state": "Online",
        "time": ""
    },
    {
        "device_ip": "192.168.1.204",
        "title": "Vasavi College VMS",
        "description": "Vasavi College",
        "imageUrl": "/customers/images/vms.png",
        "color": "green",
        "state": "Online",
        "time": ""
    }
];

const statusData = [
  {
    "Sl No": "1",
    "device_name": "Vijayamangalam CCTV",
    "downtime_started": "04/02/2024, 10:38:42 pm",
    "downtime_ended": "09/02/2024, 9:17:14 am",
    "duration": "106.63333333333334",
    "location": "Vijayamangalam Highway",
    "reason": "Power Outage",
    "device_id": "1"
  },
  {
    "Sl No": "2",
    "device_name": "Kumarapalayam CCTV",
    "downtime_started": "07/12/2023, 5:40:13 AM",
    "downtime_ended": "08/02/2024, 8:06:10 PM",
    "duration": "654.4166666666666",
    "location": "Kumarapalayam",
    "reason": "Power Outage",
    "device_id": "4"
  },
  {
    "Sl No": "3",
    "device_name": "Vasavi College VMS",
    "downtime_started": "05/02/2023, 11:52:18 PM",
    "downtime_ended": "08/02/2024, 8:09:59 PM",
    "duration": "1526",
    "location": "Vasavi College",
    "reason": "Power Outage",
    "device_id": "18"
  },
  {
    "Sl No": "4",
    "device_name": "Chengapally VMS",
    "downtime_started": "12/05/2023, 11:52:18 PM",
    "downtime_ended": "08/02/2024, 8:09:59 PM",
    "duration": "1526",
    "location": "Chengapally",
    "reason": "Power Outage",
    "device_id": "15"
  },
  {
    "Sl No": "5",
    "device_name": "Vasavi College VMS",
    "downtime_started": "05/12/2023, 11:52:18 PM",
    "downtime_ended": "09/02/2024, 9:11:48 AM",
    "duration": "1569.31667",
    "location": "Vasavi College",
    "reason": "Power Outage",
    "device_id": "18"
  }
];

const timeString = (originalDateString) => {
    // Split the date string into date and time parts
    var parts = originalDateString.split(", ");
  
    // Split the date part into day, month, year
    var dateParts = parts[0].split("/");
    var day = parseInt(dateParts[0]);
    var month = parseInt(dateParts[1]);
    var year = parseInt(dateParts[2]);
  
    // Split the time part into hours, minutes, seconds
    var timeParts = parts[1].split(":");
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1]);
    var seconds = parseInt(timeParts[2].split(" ")[0]); // Extract seconds and remove AM/PM
  
    // Adjust hours for AM/PM
    if (parts[1].includes("PM") && hours < 12) {
      hours += 12;
    } else if (parts[1].includes("AM") && hours == 12) {
      hours = 0;
    }
  
    // Pad single-digit values with leading zeros
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
  
    // Construct the formatted date string
    var formattedDateString =
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
      
    return formattedDateString;
  };
  

  
  // Function to seed the devices table
  async function seedDevicesTable() {
    try {
      // Connect to the database
      const client = await pool.connect();
  
      // Loop through the devices data and insert each item into the devices table
      for (const deviceData of devicesData) {
        const { device_ip, title, description, imageUrl, color, state, time } = deviceData;
        const query = `
          INSERT INTO devices (device_ip, title, description, image_url, color, state, time)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        const values = [device_ip, title, description, imageUrl, color, state, time];
        await client.query(query, values);
      }
  
      // Release the client back to the pool
      client.release();
  
      console.log('Devices and status tables seeded successfully');
    } catch (error) {
      console.error('Error seeding tables:', error);
    }
  }

  async function seedStatusTable() {
    try {
      // Connect to the database
      const client = await pool.connect();
  
      // Loop through the devices data and insert each item into the devices table
      for (const status of statusData) {
        const { device_name , downtime_started , downtime_ended , duration , location , reason, device_id } = status;
        const query = `
          INSERT INTO status (device_name,downtime_started,downtime_ended,duration,location,reason, device_id)
          VALUES ($1, $2, $3, $4, $5, $6,$7)
        `;
        const values = [device_name , timeString(downtime_started) , timeString(downtime_ended) , duration , location , reason, device_id];
        await client.query(query, values);
      }
  
      // Release the client back to the pool
      client.release();
  
      console.log('Devices and status tables seeded successfully');
    } catch (error) {
      console.error('Error seeding tables:', error);
    }
  }
  
  // Call the createTables function to create tables
  // createTables();
  
  // Call the seedDevicesTable function to start seeding the devices and status tables
//   seedDevicesTable();

seedStatusTable();