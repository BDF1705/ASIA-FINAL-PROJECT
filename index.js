import express from "express";
import bodyParser from "body-parser";
import pgPromise from "pg-promise";

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended : true }));

let posts = [];

app.get('/', (req, res) => {
    res.send("BANKAAIII!");
});

app.get("/posts", (req, res) => {
    const pgp = pgPromise();
    const db = pgp("postgres://postgres:admin@localhost:5432/blog");
    
    db.any("SELECT * FROM post")
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.log('ERROR:', error);
        res.status(500).json({ message: 'An error occurred' });
      });

});

app.get("/posts/:id", (req, res) => {
    const pgp = pgPromise();
    const db = pgp("postgres://postgres:admin@localhost:5432/blog");
    
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

app.post("/posts", (req, res) => {
    const pgp = pgPromise();
    const db = pgp("postgres://postgres:admin@localhost:5432/blog");
    
    const body = req.body;
    const title = body.title;
    
    const date = body.date;
    const tags = body.tags;
    const text = body.text;
    const author = body.author;

    const contentObj = {
        title: title,
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

app.put("/posts/:id", (req, res) => {
    const pgp = pgPromise();
    const db = pgp("postgres://postgres:admin@localhost:5432/blog");
    
    const postId = req.params.id;
    
    const body = req.body;
    const title = body.title;
    
    const date = body.date;
    const tags = body.tags;
    const text = body.text;
    const author = body.author;

    const contentObj = {
        title: title,
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
      })
});

app.listen(3000);