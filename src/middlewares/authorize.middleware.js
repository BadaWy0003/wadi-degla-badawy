const roleHierarchy = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  MODERATOR: 2,
  CUSTOMER: 1,
};

const authorize = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user.userType;

    if (roleHierarchy[userRole] >= roleHierarchy[requiredRole]) {
      next();
    } else {
      res.status(403).send("Access Denied");
    }
  };
};

module.exports = authorize;
