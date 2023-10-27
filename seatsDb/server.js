const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "seats.db");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3002");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

let db = null;
const port = 8080;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(port, () =>
      console.log(`Server Running at http://localhost:${port}/`)
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();
// Create a table for seats if not exists

// db.run(`
// CREATE TABLE  seats (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   seatNumber varchar(250),
//   isBooked BOOLEAN,
//   type TEXT
// );`);

// API  for  get all seats
// app.get("/seats/", async (req, res) => {
//   await db.all(`SELECT * FROM seats`, (err, rows) => {
//     if (err) {
//       console.error(err.message);
//       res.status(500).send("Internal Server Error");
//     } else {
//       res.json(rows);
//     }
//   });
// });

app.get("/seats", async (request, response) => {
  const getSeatsQuery = `
    SELECT
      *
    FROM
      seats
    ;`;
  const SeatsArray = await db.all(getSeatsQuery, (err) => {
    if (err) {
      console.error(err.message);
      response.status(500).send("Internal Server Error");
    }
  });
  response.send(SeatsArray);
});

// totalAvailableSeats;

app.get("/totalAvailableSeats", async (req, res) => {
  const query = `SELECT (180-count(seatReserved)) as remainingSeats FROM seats where seatReserved=1`;
  const remainingSeats = await db.get(query, (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  });
  res.send(remainingSeats);
});

//get-current-booked-seats array
app.get("/get-current-booked-seats", async (req, res) => {
  const { type } = req.query;
  const seatReservedIds = await db.all(
    `SELECT id as seatReservedId FROM seats WHERE isBooked=1 and seatReserved=0 and type="${type}"`,
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
      }
    }
  );
  const seatReservedIdsList = seatReservedIds.map(
    (item) => item.seatReservedId
  );
  res.send(seatReservedIdsList);
});

// toggle-seat-selection/:seatId
app.put("/toggle-seat-selection/:seatId", async (req, res) => {
  const { seatId } = req.params;
  const { limit, type } = req.query;

  await db.all(
    `UPDATE seats
      SET isBooked = CASE
      WHEN isBooked = 1 AND seatReserved = 0 AND id BETWEEN ${parseInt(
        seatId
      )} AND ${parseInt(seatId) + parseInt(limit) - 1} AND type='${type}' THEN 0
      WHEN seatReserved = 0 AND id NOT BETWEEN ${parseInt(seatId)} AND ${
        parseInt(seatId) + parseInt(limit) - 1
      } THEN 0
      ELSE 1
      END
      where  type = '${type}' ;
`,

    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
      }
    }
  );
  res.send({
    message: "Seat Toggled successfully",
  });
});

// set - reserved - seats - value;

app.post("/book-tickets", async (req, res) => {
  const { selectedSeatsIDsArray } = req.body;
  const { type } = req.query;

  if (selectedSeatsIDsArray) {
    try {
      await Promise.all(
        selectedSeatsIDsArray.map(async (id) => {
          await new Promise((resolve, reject) => {
            db.run(
              `UPDATE seats SET seatReserved = 1, isBooked = 1 WHERE id = ${id} and type='${type}'`,
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

      res.json({ message: "Seats Booked successfully" });
    } catch (error) {
      res.status(500);
      res.send("Internal Server Error");
    }
  } else {
    res.status(400);
    res.send({ error: "Invalid request payload" });
  }
});
