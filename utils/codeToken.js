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

exports.generateToken = async (code)=>{
    const token = jwt.sign(
        {
          code: code.code,
          level: code.level,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3h" }
      );
      return token;
}