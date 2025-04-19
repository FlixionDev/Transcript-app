const jwt = require("jsonwebtoken")

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (decoded) {
                req.userId = decoded.userId;
                next();
            } else {
                res.status(401).send({ "message": "Something went wrong. Please login again" })
            }
        });
    } else {
        res.status(401).send({ "message": "Please login first" })
    }
}

module.exports = { authenticateUser }
