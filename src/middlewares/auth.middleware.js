const jwt = require("jsonwebtoken");
const prisma = require("../database");

const userAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies["auth"] || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      throw new Error("Invalid Auth Token");
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: decodedToken.id },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized. Invalid Credentials");
  }
};

module.exports = userAuth;
