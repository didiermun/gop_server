const jwt = require("jsonwebtoken");

exports.verifyToken = async(req, res, next) => {
    let token = req.headers["codeToken"];
    if (!token) {
        return res.status(401).send({message:"UNAUTHENTICATED"});
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, code) => {
        if (err) {
          return res.status(401).send({message:"FAILED WHILE AUTHENTICATING"});
        }
        else if (code) {
          req.headers["code"] = code;
          return next();
        }
        else{
            return res.send("MIA").status(500);
        }
      });
}