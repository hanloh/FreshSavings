require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const mysql = require("mysql2");
const bodyParser = require("body-parser");
const axios = require("axios");
const session = require("express-session");
axios.defaults.withCredentials = true;

const url = "http://localhost:3000/test_session";

// Make a GET request to the test_session endpoint
axios
  .get(url, {
    withCredentials: true, // Ensure that credentials are included in the request
  })
  .then((response) => {
    console.log("Response data:", response.data);
  })
  .catch((error) => {
    console.error("Error occurred:", error);
  });

app.use(
  cors({
    credentials: true,
    origin: true,
    exposedHeaders: "Set-Cookie",
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "Set-Cookie");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/login', Anyroute)
// app.use(express.json())
// app.use('/api', Anyroute)

// Create a MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  })
);

console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_NAME);

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

app.get("/get_all_ingredients", (req, res) => {
  // Query the database to retrieve ingredients
  connection.query("SELECT * FROM freshsavings.Ingredient", (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

app.get("/get_all_products", (req, res) => {
  // Query the database to retrieve ingredients
  connection.query(
    "select expiring_in, pid, Ingredient.iid, Ingredient.iname, selling_price, selling_quantity, fname, lname, said, Account.postalcode, Account.a_lat, Account.a_long, posting_status, icat, Ingredient.price, image from freshsavings.Posting, freshsavings.Account, freshsavings.Ingredient where Posting.said = Account.aid and Posting.iid = Ingredient.iid",
    (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.json(results);
    }
  );
});

app.get("/get_product_description/:pid", (req, res) => {
  // Query the database to retrieve ingredients
  const pid = parseInt(req.params.pid);
  connection.query(
    "select expiring_in, pid, Ingredient.iid, Ingredient.iname, selling_price, selling_quantity, fname, lname, said, Account.postalcode, Account.a_lat, Account.a_long, posting_status, icat, Ingredient.price, image from freshsavings.Posting, freshsavings.Account, freshsavings.Ingredient where Posting.said = Account.aid and Posting.iid = Ingredient.iid and Posting.pid = ?",
    [pid],
    (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.json(results);
    }
  );
});
app.get("/get_address/:aid", (req, res) => {
  // Query the database to retrieve ingredients
  const aid = parseInt(req.params.aid);
  connection.query(
    "select postalcode, a_lat, a_long from freshsavings.Account where aid = ?",
    [aid],
    (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.json(results);
    }
  );
});
app.get("/get_all_ingredients_categories", (req, res) => {
  // Query the database to retrieve ingredients
  connection.query(
    "select iid, iname, icat, img from freshsavings.Ingredient order by icat",
    (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.json(results);
    }
  );
});

app.get("/get_all_recipes", (req, res) => {
  // Query the database to retrieve ingredients
  connection.query(
    "SELECT r.rid, ri.iid, rname, i.iname, r.rimg, ri.qty, r.url FROM freshsavings.RecipeIngredient ri, freshsavings.Recipe r, freshsavings.Ingredient i WHERE ri.rid = r.rid AND i.iid = ri.iid;",
    (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.json(results);
    }
  );
});

app.get("/get_user_inventory_items/:userid", (req, res) => {
  const userid = parseInt(req.params.userid);

  // aid of currently logged-in user
  connection.query(
    // TODO: make query more specific after finalising the data to fetch
    "SELECT a.aid, a.iid, i.iname, a.qty, a.expiring_in, i.icat, i.emoji FROM freshsavings.AccountInventory a JOIN freshsavings.Ingredient i ON a.iid = i.iid WHERE a.aid = ?;",
    [userid],
    (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    }
  );
});
app.post("/InventorytoPosting/:aid/:iid/:s_price", (req, res) => {
  const aid = parseInt(req.params.aid);
  const iid = parseInt(req.params.iid);
  const s_price = parseFloat(req.params.s_price);
  connection.query(
    "SELECT Ingredient.iid, postingImage, qty FROM freshsavings.AccountInventory, freshsavings.Ingredient WHERE Ingredient.iid = AccountInventory.iid AND AccountInventory.aid = ? AND AccountInventory.iid = ?",
    [aid, iid],
    (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      console.log(results[0]);
      const { postingImage, qty, ExpiryDate } = results[0];

      connection.query(
        "INSERT INTO freshsavings.Posting (iid, expiring_in, selling_price, selling_quantity, said, posting_status, image, ExpiryDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [iid, 1, s_price, qty, aid, "Active", postingImage, ExpiryDate],

        (err, results) => {
          if (err) {
            console.error("Error querying the database:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }
          connection.query(
            "DELETE FROM freshsavings.AccountInventory where aid = ? and iid = ?",
            [aid, iid],

            (err, results) => {
              if (err) {
                console.error("Error querying the database:", err);
                res.status(500).json({ error: "Internal Server Error" });
                return;
              }
            }
          );
        }
      );
    }
  );
});
app.post("/afterCheckOut/:aid/:arrPid", (req, res) => {
  const aid = parseInt(req.params.aid);
  const arrPid = req.body.arrPid.map((pid) => parseInt(pid));
  console.log("params");
  console.log(aid);
  console.log(arrPid);
  for (const pid of arrPid) {
    connection.query(
      "SELECT Ingredient.iid, selling_quantity, emoji, expiring_in FROM freshsavings.Posting, freshsavings.Ingredient WHERE Posting.iid = Ingredient.iid AND Posting.pid = ?",
      [pid],
      (err, results) => {
        if (err) {
          console.error("Error querying the database:", err);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }
        console.log(results);
        console.log("This is aftercheckout");
        const { iid, selling_quantity, ExpiryDate, emoji } = results[0];

        connection.query(
          "INSERT INTO freshsavings.AccountInventory (aid, iid, expiring_in, qty) VALUES (?, ?, ?, ?)",
          [aid, iid, expiring_in, selling_quantity],
          (err, results) => {
            if (err) {
              console.error("Error querying the database:", err);
              res.status(500).json({ error: "Internal Server Error" });
              return;
            }
            connection.query(
              "DELETE FROM freshsavings.Posting WHERE pid = ?",
              [pid],
              (err, results) => {
                if (err) {
                  console.error("Error querying the database:", err);
                  res.status(500).json({ error: "Internal Server Error" });
                  return;
                }
                res.json(results);
              }
            );
          }
        );
      }
    );
  }
});

app.all("/login", (req, res) => {
  if (req.method === "GET") {
    res.send("Login form");
  } else if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    connection.query(
      "SELECT * FROM freshsavings.Account WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          console.error("Error querying the database:", err);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }
        if (results.length > 0) {
          if (results[0].password === password) {
            // Login successful, store the user data in the session
            req.session.user = results[0];

            console.log("User data stored in session:", req.session.user); // Log the user data in the session
            res.json({
              message: "Login successful",
              user: results[0],
              session: req.session,
            });
          } else {
            // Incorrect password, return an error message
            res.status(401).json({ error: "Invalid credentials" });
          }
        } else {
          // User not found, return an error message
          res.status(404).json({ error: "User not found" });
        }
      }
    );
  } else {
    // Handle other HTTP methods
    res.status(405).send("Method Not Allowed");
  }
});

app.get("/test_session", (req, res) => {
  if (req.session && req.session.user) {
    const user = req.session.user;
    console.log("User data from session:", user);
    res.status(200).json({ message: "User is logged in", user });
  } else {
    res.status(401).json({ message: "User is not logged in" });
  }
});

app.get("/get-session-data", (req, res) => {
  if (req.session && req.session.user) {
    // Include the session data in the response
    console.log("hello");
    console.log(req.session);
    res.json({ session: req.session });
  } else {
    res.status(401).json({ message: "User is not logged in" });
  }
});

app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push("Email is required.");
  }

  if (!password) {
    errors.push("Password is required.");
  } else if (password.length < 8) {
    errors.push("Password should be at least 8 characters long.");
  }

  const emailFormat = /^\S+@\S+\.\S+$/;
  if (email && !email.match(emailFormat)) {
    errors.push("Invalid email format.");
  }

  // Return errors array if any errors are found
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  connection.query(
    "SELECT * FROM freshsavings.Account WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ errors: ["Email already exists."] });
      }

      // Hardcode the postal code and retrieve its latitude and longitude
      const postalCode = "670641";
      const latitude = "1.38765766146094";
      const longitude = "103.76208975109";

      // Store user data in the session
      req.session.user = { email, password, postalCode, latitude, longitude };
      console.log("User data stored in session:", req.session.user);

      // Insert the new user record with the postal code and its coordinates
      connection.query(
        "INSERT INTO freshsavings.Account (email, password, postalcode, a_lat, a_long) VALUES (?, ?, ?, ?, ?)",
        [email, password, postalCode, latitude, longitude],
        (err, results) => {
          if (err) {
            console.error("Error inserting into the database:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          res.json({
            message: "User created successfully.",
            user: req.session.user,
            session: req.session,
          });
        }
      );
    }
  );
});

app.get("/get-distance", async (req, res) => {
  try {
    const originLat = req.query.originLat;
    const originLng = req.query.originLng;
    const destLat = req.query.destLat;
    const destLng = req.query.destLng;
    const units = req.query.units;
    const apiKey = req.query.apiKey;

    // Construct the API URL using latitude and longitude
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&units=${units}&key=${apiKey}`;

    // Make the API request to Google Maps
    const response = await axios.get(apiUrl);

    // Return the response data to the client
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/add_inventory_item", (req, res) => {
  const { aid, iid, expiring_in, qty, ExpiryDate } = req.body; // Extract data from the request body

  // Construct the SQL query to insert a new row into the AccountInventory table
  const sql = `INSERT INTO freshsavings.AccountInventory (aid, iid, expiring_in, qty, ExpiryDate) VALUES ('${aid}', '${iid}', ${expiring_in}, ${qty}, '${ExpiryDate}')`;

  // Execute the SQL query
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error adding item to inventory:", err);
      return res.status(500).send("Error adding item to inventory");
    }

    console.log("New inventory item added to AccountInventory");

    // Query the database to get the newly added item
    const fetchNewItemSQL = `SELECT * FROM freshsavings.AccountInventory WHERE aid = '${aid}' AND iid = '${iid}'`;
    connection.query(fetchNewItemSQL, (fetchErr, fetchResult) => {
      if (fetchErr) {
        console.error("Error fetching newly added item:", fetchErr);
        return res.status(500).send("Error fetching newly added item");
      }

      const newItem = fetchResult[0]; // Assuming the query result is an array with a single item
      res.status(200).json(newItem); // Send the newly added item as the response
    });
  });
});

app.get("/get_ingredient_id_by_name", (req, res) => {
  const ingredientName = req.query.name;

  connection.query(
    "SELECT iid FROM freshsavings.Ingredient WHERE iname = ?",
    [ingredientName],
    (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (results.length > 0) {
        const ingredientId = results[0].iid;
        res.json({ iid: ingredientId });
      } else {
        res.json({ iid: null });
      }
    }
  );
});

app.get("/logout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Logout successful" });
    }
  });
});

// TO DO: check if it's right
app.post("/insertNewInventoryItem", (req, res) => {
  const updatedData = req.body;

  // Perform the SQL update operation
  const AccountInventoryQuery =
    "INSERT INTO freshsavings.AccountInventory(aid,iid, expiring_in, qty, ExpiryDate, emoji) VALUES (?, ?, 3, ?, ?, ?);";
  const IngredientQuery =
    "INSERT INTO freshsavings.Ingredient(iid, iname, icat) VALUES (?,?,?,?); ";

  connection.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    connection.query(
      AccountInventoryQuery,
      [aid, iid, expiring_in, qty, ExpiryDate],
      (error, productResults) => {
        if (error) {
          return connection.rollback(() => {
            console.error("Error inserting data into products:", error);
            res.status(500).send("Internal Server Error");
          });
        }

        connection.query(
          IngredientQuery,
          [iid, iname, icat],
          (inventoryError) => {
            if (inventoryError) {
              return connection.rollback(() => {
                console.error(
                  "Error inserting data into inventory:",
                  inventoryError
                );
                res.status(500).send("Internal Server Error");
              });
            }

            connection.commit((commitError) => {
              if (commitError) {
                return connection.rollback(() => {
                  console.error("Error committing transaction:", commitError);
                  res.status(500).send("Internal Server Error");
                });
              }

              res.status(200).send("Data inserted successfully");
            });
          }
        );
      }
    );
  });
});

app.delete("/delete-data", (req, res) => {
  const dataToDelete = req.body;

  // Use a SQL query to delete data from your database
  const sql =
    "DELETE FROM freshsavings.AccountInventory WHERE aid = ? and iid =  ?";

  // Execute the SQL query with the data to delete
  yourDatabaseConnection.query(sql, [dataToDelete.id], (error, results) => {
    if (error) {
      console.error("Error deleting data:", error);
      res.status(500).send("Error deleting data");
    } else {
      console.log("Data deleted successfully");
      res.status(200).send("Data deleted successfully");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/get_inventory_and_images/:userid", (req, res) => {
  const userid = parseInt(req.params.userid);

  connection.query(
    `SELECT ai.iid, ai.qty, i.iname, ai.expiring_in, i.postingImage FROM freshsavings.AccountInventory ai, freshsavings.Ingredient i WHERE i.iid = ai.iid and ai.aid = ?;`,
    [userid],
    (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    }
  );
});
