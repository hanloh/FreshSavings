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

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

app.get("/get_all_ingredients", (req, res) => {

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
  connection.query(
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
    "SELECT Ingredient.iid, postingImage, qty, expiring_in FROM freshsavings.AccountInventory, freshsavings.Ingredient WHERE Ingredient.iid = AccountInventory.iid AND AccountInventory.aid = ? AND AccountInventory.iid = ?",
    [aid, iid],
    (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      console.log(results[0]);
      const { postingImage, qty, expiring_in } = results[0];

      connection.query(
        "INSERT INTO freshsavings.Posting (iid, expiring_in, selling_price, selling_quantity, said, posting_status, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [iid, expiring_in, s_price, qty, aid, 'Active', postingImage],
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
      "SELECT Ingredient.iid, selling_quantity, expiring_in, emoji FROM freshsavings.Posting, freshsavings.Ingredient WHERE Posting.iid = Ingredient.iid AND Posting.pid = ?",
      [pid],
      (err, results) => {
        if (err) {
          console.error("Error querying the database:", err);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }
        console.log(results);
        console.log("This is aftercheckout");
        const { iid, selling_quantity, expiring_in, emoji } = results[0];

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
            req.session.user = results[0];

            console.log("User data stored in session:", req.session.user); // Log the user data in the session
            res.json({
              message: "Login successful",
              user: results[0],
              session: req.session,
            });
          } else {
            res.status(401).json({ error: "Invalid credentials" });
          }
        } else {
          res.status(404).json({ error: "User not found" });
        }
      }
    );
  } else {
    res.status(405).send("Method Not Allowed");
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

      const postalCode = "670641";
      const latitude = "1.38765766146094";
      const longitude = "103.76208975109";

      req.session.user = { email, password, postalCode, latitude, longitude };
      console.log("User data stored in session:", req.session.user);

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

    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&units=${units}&key=${apiKey}`;

    const response = await axios.get(apiUrl);

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/add_inventory_item", (req, res) => {
  const { aid, iid, expiring_in, qty } = req.body;

  const sql = `INSERT INTO freshsavings.AccountInventory (aid, iid, expiring_in, qty) VALUES ('${aid}', '${iid}', ${expiring_in}, ${qty}')`;

  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error adding item to inventory:", err);
      return res.status(500).send("Error adding item to inventory");
    }

    console.log("New inventory item added to AccountInventory");

    const fetchNewItemSQL = `SELECT * FROM freshsavings.AccountInventory WHERE aid = '${aid}' AND iid = '${iid}'`;
    connection.query(fetchNewItemSQL, (fetchErr, fetchResult) => {
      if (fetchErr) {
        console.error("Error fetching newly added item:", fetchErr);
        return res.status(500).send("Error fetching newly added item");
      }

      const newItem = fetchResult[0];
      res.status(200).json(newItem);
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
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Logout successful" });
    }
  });
});


app.delete("/delete-data", (req, res) => {
  const dataToDelete = req.body;

  const sql =
    "DELETE FROM freshsavings.AccountInventory WHERE aid = ? and iid =  ?";

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

app.get("/get_inventory_and_images/:userid", (req, res) => {
    const userid = parseInt(req.params.userid);
  
    connection.query(
      `SELECT ai.iid, ai.qty, i.iname, ai.expiring_in, i.postingImage, i.icat FROM freshsavings.AccountInventory ai, freshsavings.Ingredient i WHERE i.iid = ai.iid and ai.aid = ?;`,
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


app.post("/DecreaseQuantity/:aid/:iid/:expiring_in"), (req, res) => {
  const aid = parseInt(req.params.aid);
  const iid = parseInt(req.params.iid);
  const expiring_in = parseInt(req.params.expiring_in);
  connection.query(
    "SELECT qty FROM freshsavings.AccountInventory WHERE AccountInventory.aid = ? AND AccountInventory.iid = ? AND AccountInventory.expiring_in = ?",
    [aid, iid, expiring_in],
    (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      
      const {qty} = results[0];
      let new_qty = qty - 1
      if(new_qty == 0){
        connection.query(
          "DELETE FROM freshsavings.AccountInventory WHERE AccountInventory.aid = ? AND AccountInventory.iid = ? AND AccountInventory.expiring_in = ?",
          [aid, iid, expiring_in],
          (err, results) => {
            if (err) {
              console.error("Error querying the database:", err);
              res.status(500).json({ error: "Internal Server Error" });
              return;
            }
          }
        );
      }
      else{
      connection.query(
        "UPDATE freshsavings.AccountInventory SET qty = ? WHERE AccountInventory.aid = ? AND AccountInventory.iid = ? AND AccountInventory.expiring_in = ?",
        [new_qty, aid, iid, expiring_in],
        (err, results) => {
          if (err) {
            console.error("Error querying the database:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }
        }
      );
      }
    }
  );
}

app.post("/IncreaseQuantity/:aid/:iid/:expiring_in"), (req, res) => {
  const aid = parseInt(req.params.aid);
  const iid = parseInt(req.params.iid);
  const expiring_in = parseInt(req.params.expiring_in);
  connection.query(
    "SELECT qty FROM freshsavings.AccountInventory WHERE AccountInventory.aid = ? AND AccountInventory.iid = ? AND AccountInventory.expiring_in = ?",
    [aid, iid, expiring_in],
    (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      
      const {qty} = results[0];
      let new_qty = qty + 1

      connection.query(
        "UPDATE freshsavings.AccountInventory SET qty = ? WHERE AccountInventory.aid = ? AND AccountInventory.iid = ? AND AccountInventory.expiring_in = ?",
        [new_qty, aid, iid, expiring_in],
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

app.post("/DeleteItem/:aid/:iid/:expiring_in", (req, res) => {
  const aid = parseInt(req.params.aid);
  const iid = parseInt(req.params.iid);
  const expiring_in = parseInt(req.params.expiring_in);
connection.query(
  "DELETE FROM freshsavings.AccountInventory WHERE AccountInventory.aid = ? and AccountInventory.iid = ? and AccountInventory.expiring_in = ?",
  [aid, iid, expiring_in],
  (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  }
)
})

app.post("/AddNewItem/:aid/:iid/:expiring_in/:qty", (req, res) => {
  const aid = parseInt(req.params.aid);
  const iid = parseInt(req.params.iid);
  const expiring_in = parseInt(req.params.expiring_in);
  const qty = parseInt(req.params.qty);
connection.query(
  "INSERT INTO freshsavings.AccountInventory (aid, iid, expiring_in, qty) VALUES (?, ?, ?, ?)",
  [aid, iid, expiring_in, qty],
  (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  }
)
})



app.post("/InventorytoPosting/:aid/:iid/:s_price", (req, res) => {
  const aid = parseInt(req.params.aid);
  const iid = parseInt(req.params.iid);
  const s_price = parseFloat(req.params.s_price);
  connection.query(
    "SELECT Ingredient.iid, postingImage, qty, expiring_in FROM freshsavings.AccountInventory, freshsavings.Ingredient WHERE Ingredient.iid = AccountInventory.iid AND AccountInventory.aid = ? AND AccountInventory.iid = ?",
    [aid, iid],
    (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      console.log(results[0]);
      const { postingImage, qty, expiring_in } = results[0];

      connection.query(
        "INSERT INTO freshsavings.Posting (iid, expiring_in, selling_price, selling_quantity, said, posting_status, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [iid, expiring_in, s_price, qty, aid, 'Active', postingImage],
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});