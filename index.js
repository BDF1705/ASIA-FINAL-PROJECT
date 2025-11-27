import express from "express";
import bodyParser from "body-parser";
import pgPromise from "pg-promise";
import dotenv from "dotenv";

import { rateLimiter } from "./middlewares/rateLimiter.js";
import { authenticateJWT } from "./middlewares/auth.js";

dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPasswd = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const app = express();
app.use(bodyParser.json());
app.use(rateLimiter);
app.use(express.urlencoded({ extended : true }));

app.get('/', (req, res) => {
    res.sendFile('../../../../index.html');
});

app.get("/posts", authenticateJWT, (req, res) => {
  const pgp = pgPromise();
  const db = pgp(`postgres://${dbUser}:${dbPasswd}@${dbHost}:${dbPort}/${dbName}`);
    db.any("SELECT * FROM post")
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.log('ERROR:', error);
        res.status(500).json({ message: 'An error occurred' });
      });

});

app.get("/posts/:id", authenticateJWT, (req, res) => {
    const pgp = pgPromise();
    const db = pgp(`postgres://${dbUser}:${dbPasswd}@${dbHost}:${dbPort}/${dbName}`);
    const postId = req.params.id;

    db.one("SELECT * FROM post WHERE id = $1", [postId])
      .then((data) => {
        res.json(data);
      })
      .catch((error, data) => {
        if (data == undefined) {
            res.json({ message: 'No data available' });
        }
        else {
            console.log('ERROR:', error);
            res.status(500).json({ message: 'An error occurred' });
        }
      });

});

app.post("/posts", authenticateJWT, (req, res) => {
    const pgp = pgPromise();
    const db = pgp(`postgres://${dbUser}:${dbPasswd}@${dbHost}:${dbPort}/${dbName}`);
    const body = req.body;
    const title = body.title;
    
    const date = body.date;
    const tags = body.tags;
    const text = body.text;
    const author = body.author;

    const contentObj = {
        date: date,
        tags: tags,
        text: text,
        author: author
    };

    const content = JSON.stringify(contentObj);

    db.none("INSERT INTO post(title, content) VALUES(${title}, ${content})", {
        title: title,
        content: content
    })
      .then(() => {
        res.status(201).json({ message: "Successful!" });
      })
      .catch((error) => {
        console.error("ERROR:", error);
        res.status(500).json({ message: "An error occured while creating the post"});
      })
});

app.put("/posts/:id", authenticateJWT, (req, res) => {
    const pgp = pgPromise();
    const db = pgp(`postgres://${dbUser}:${dbPasswd}@${dbHost}:${dbPort}/${dbName}`);
    const postId = req.params.id;
    
    const body = req.body;
    const title = body.title;
    
    const date = body.date;
    const tags = body.tags;
    const text = body.text;
    const author = body.author;

    const contentObj = {
        date: date,
        tags: tags,
        text: text,
        author: author
    };

    const content = JSON.stringify(contentObj);

    db.none("UPDATE post SET title = ${title}, content = ${content} WHERE id = ${id}", {
        id: postId,
        title: title,
        content: content
    })
      .then(() => {
        res.status(201).json({ message: "Successful!" });
      })
      .catch((error) => {
        console.error("ERROR:", error);
        res.status(500).json({ message: "An error occured while creating the post"});
      });
});

app.delete("/posts/:id", authenticateJWT, (req, res) => {
    const pgp = pgPromise();
    const db = pgp(`postgres://${dbUser}:${dbPasswd}@${dbHost}:${dbPort}/${dbName}`);
    const postId = req.params.id;

    db.none("DELETE FROM post WHERE id = ${id}", {
        id: postId,
    })
      .then(() => {
        res.status(201).json({ message: "Successful!" });

        return db.one("SELECT COUNT(*) AS count from post")
        .then((data) => {
          const resetIdTo = parseInt(data.count) + 1;
          
          return db.none("ALTER SEQUENCE post_id_seq RESTART WITH ${resetId}", {
            resetId: resetIdTo
          });
        });
      })
      .catch((error) => {
        console.error("ERROR:", error);
        res.status(500).json({ message: "An error occured while creating the post"});
      });
});

app.listen(3000);