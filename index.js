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
      });

});


app.listen(3000);