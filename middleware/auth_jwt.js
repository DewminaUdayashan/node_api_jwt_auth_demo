
import jwt from 'jsonwebtoken';


export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    /// this [authHeader && ] means split and get token if authHeader is defined
    /// otherwise put token as the `undefined`
    const token = authHeader && authHeader.split(' ')[1];
    // if token not sended by user, send this
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        //token no longer valid
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};
