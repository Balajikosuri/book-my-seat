// server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const bodyParser = require("body-parser");
// const router = express.Router();
app.use(express.json());


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});


const port = 8080;

// Connect to SQLite database
const db = new sqlite3.Database("./seats.db");

// Create a table for seats if not exists

// db.run(`
// CREATE TABLE  seats (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   seatNumber varchar(250),
//   isBooked BOOLEAN,
//   type TEXT
// );`);

// API  for  get all seats
app.get("/seats", async (req, res) => {
  await db.all("SELECT * FROM seats", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(rows);
    }
  });
});

// totalAvailableSeats;

app.get("/totalAvilabelSeats", async (req, res) => {
  await db.get(
    "SELECT (180-count(seatReserved)) as remainingSeats FROM seats where seatReserved=1",
    (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
      } else {
        res.json(rows);
      }
    }
  );
});

//get-current-booked-seats array
app.get("/get-current-booked-seats", async (req, res) => {
  await db.all(
    "SELECT id as seatReservedId FROM seats WHERE isBooked=1 and seatReserved=0",
    (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
      } else {
        res.json(rows.map((item) => item.seatReservedId));
      }
    }
  );
});

// toggle-seat-selection/:seatId
app.put("/toggle-seat-selection/:seatId", async (req, res) => {
  const { seatId } = req.params;
  const { limit, type } = req.query;
  // console.log(type);
  await db.all(
    `UPDATE seats
      SET isBooked = CASE
      WHEN isBooked = 1 AND seatReserved = 0 AND id BETWEEN ${parseInt(
        seatId
      )} AND ${parseInt(seatId) + parseInt(limit) - 1} THEN 0
      WHEN seatReserved = 0 AND id NOT BETWEEN ${parseInt(seatId)} AND ${
        parseInt(seatId) + parseInt(limit) - 1
      } THEN 0
      ELSE 1
      END
      where  type like '${type}' ;
`,

    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
      } else {
        res.json({ message: "Seat updated successfully" });
      }
    }
  );
});

// set - reserved - seats - value;

app.post("/set-reserved-seats-value", async (req, res) => {
  const { selectedSeatsIDsArray } = req.body;

  if (selectedSeatsIDsArray) {
    try {
      await Promise.all(
        selectedSeatsIDsArray.map(async (id) => {
          await new Promise((resolve, reject) => {
            db.run(
              `UPDATE seats SET seatReserved = 1, isBooked = 1 WHERE id = ${id}`,
              (err) => {
                if (err) {
                  console.error(err.message);
                  reject(err);
                } else {
                  resolve();
                }
              }
            );
          });
        })
      );

      res.json({ message: "Seats updated successfully" });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(400).json({ error: "Invalid request payload" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
