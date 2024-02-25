const cron = require("node-cron");
const axios = require("axios");
const pool = require("./db");

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
  // if (originalDateString.includes("pm") && hours < 12) {
  //   hours += 12;
  // }

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

function scheduleCronJob() {
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        // Make the API call
        const response = await axios.get(
          "http://localhost:3001/api/data_where?query=devices"
        );

        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}/${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}/${String(currentDate.getDate()).padStart(
          2,
          "0"
        )} ${String(currentDate.getHours()).padStart(2, "0")}:${String(
          currentDate.getMinutes()
        ).padStart(2, "0")}:${String(currentDate.getSeconds()).padStart(
          2,
          "0"
        )}`;

        response.data.forEach(async (d) => {
          const timeStarted = new Date(d.time);
          const timeDiff = currentDate - timeStarted;
          const hours = timeDiff / (1000 * 60 * 60);

          if (hours > 0.15) {
            // Perform database insertion
            const formattedTimeDiff = `${hours}`;
            await pool.query(
              "INSERT INTO status (device_name, downtime_started, downtime_ended, duration, location, reason, device_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
              [
                d.title,
                timeString(timeStarted), // Assuming 'timeString' is defined
                timeString(formattedDate), // Assuming 'timeString' is defined
                formattedTimeDiff, // Assuming 'formattedTimeDiff' is defined
                d.description,
                "Power Outage",
                d.id,
              ]
            );
            console.log("succesfully ran scheduled job ", currentDate, d.id);
            const client = await pool.connect();
            await client.query(
              "UPDATE devices SET color = $1, time = $2, state = $3 WHERE id = $4",
              ["red", currentDate, "Offline", d.id]
            );
            client.release();
          }
        });
      } catch (error) {
        console.error("Error making API call:", error.message);
      }
    },
    {
      timezone: "Asia/Kolkata", // Specify your timezone, e.g., 'America/New_York'
    }
  );
}

module.exports = scheduleCronJob;
