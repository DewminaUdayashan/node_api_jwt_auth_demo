import express from "express";
import { config } from "dotenv";
import {authenticateToken} from './middleware/auth_jwt.js'
config();

const app = express();

const posts = [
    {
        "username": "DEWMINA",
        "title": "title"
    },
    {
        "username": "Jhone",
        "title": "joe"
    }
];

app.use(express.json());

//everything below this line will use authenticateToken middleware and so
// it will authenticate jwts
// if you want to add login,registrations like functions, those should be above the this line
app.use(authenticateToken);
app.get('/posts', (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
});

app.listen(3000);