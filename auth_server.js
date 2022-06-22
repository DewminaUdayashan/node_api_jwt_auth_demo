import express from "express";
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
import bcrypt from 'bcrypt';
config();

const app = express();

app.use(express.json());

// store refreshTokens in a DB or something
// don't store it in like this. this is only for demostration
let refreshTokens = [];


// refreshing the token from user refresh token when they posted it
app.post('/token',(req,res)=>{
    // get refresh token from the request body
    const refreshToken = req.body.token;
    if(refreshToken==null) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403);
        /// user object that was returned from the function has many attributes
        /// so, we can pass the custom user object that we are expecting
        const accessToken = generateAccessToken( { name: user.name, designation: user.designation });
        res.json({accessToken:accessToken});
    });
});

// delete the user refresh token
app.delete('/logout',(req,res)=>{
    refreshTokens = refreshTokens.filter(token=>token!==req.body.token);
    res.sendStatus(204)
});

app.post('/login', (req, res) => {
    // authenticate user
    const username = req.body.username;
    // this object hold user data, change this as needed
    const user = { name: username, designation: 'App Dev' };
    const accessToken = generateAccessToken(user,process.env.REFRESH_TOKEN_SECRET);
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
    // save referesh tokens in the DB when they are created
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
}); 

app.post('/signup',async (req,res)=>{
    try {
        // there may be same password entered by multiple users
        // if we just hashed a password, it is not good in this case
        // so we can add specific salt value when we are hashing the pw
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
    } catch (error) {
        
    }
});


function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:'15s' //change about to 10min-30min
    });
};

app.listen(4000);