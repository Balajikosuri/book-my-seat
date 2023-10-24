// server.js
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
const port = 8080;

app.use(bodyParser.json());

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

// API endpoint to get all seats

app.get("/seats", (req, res) => {
  db.all("SELECT * FROM seats", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(rows);
    }
  });
});
app.get("/totalAvilabelSeats", (req, res) => {
  db.get(
    "SELECT count(isBooked) as remainingSeats FROM seats where isBooked=0",
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

//
app.get("/get-current-booked-seats", (req, res) => {
  db.all(
    "SELECT id as seatReservedId FROM seats WHERE isBooked=1",
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

//

app.put("/seats/:seatId", (req, res) => {
  const { seatId } = req.params;

  db.all(
    `UPDATE seats 
    SET isBooked = 1 
    WHERE id = ${seatId}`,

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

app.put("/dseats/:seatId", (req, res) => {
  const { seatId } = req.params;

  db.run(
    `UPDATE seats 
    SET isBooked = 0 
    WHERE id = ${seatId}`,

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

// selected type of seats
app.put("/seats", (req, res) => {
  const { startSeatId, seatType, limit } = req.query;

  // Assuming 'isBooked' is the column for seat status and 'limit' is another column in your table
  const query = `UPDATE seats 
                 SET isBooked = 1 
                 WHERE id >= ${startSeatId} AND id <= ${
                   parseInt(startSeatId) + parseInt(limit)
                 } 
                 AND type = '${seatType}' AND limit > 0`;

  db.run(query, (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    } else {
      res.json({ message: "Seats updated successfully" });
    }
  });
});

app.put("/set-reserved-seats-value/:seatId", (req, res) => {
  const { seatId } = req.params;

  db.run(
    `UPDATE seats 
    SET seatReserved = 1 
    WHERE id = ${seatId} and isBooked`,

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

// API endpoint to book seats
app.post("/bookSeats", (req, res) => {
  const { seatType, seatCount } = req.body;

  // Logic to book seats in the database
  // ...

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
