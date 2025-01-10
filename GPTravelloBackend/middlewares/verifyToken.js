const JWT = require("jsonwebtoken");
//verify token
function verifyToken(req, res, next) {
    const token = req.headers.token;
    if (token) {
        try {
            const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;
            next();
        } catch {
            res.status(401).json({ message: "invaild token" })
        }
    } else {
        res.status(401).json({ message: "no token provided" })
    }
}

//Verify Token And Authorize The User
function VerifyTokenAndAutherization(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "you are not allowed" })
        }
    })

}

//Verify Token And Admin
function VerifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "you are not allowed,only admin" })
        }
    })

}
module.exports = { verifyToken, VerifyTokenAndAutherization, VerifyTokenAndAdmin };