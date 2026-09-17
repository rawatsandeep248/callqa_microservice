const ACCESS_CONFIG = require("../protos/rbac_config.js");
function rbac_handler(groupNames) {
  return function rbac_handlerMiddleware(req, res, next) {
    // console.log(req.headers['rbac_role']," url :", req.url);
    // const userRole = req.headers['rbac_role'];
    const userRole = req.role;
    console.log("userRole", userRole);
    if (!userRole) {
      return res.status(403).json({
        message: "User role is missing",
      });
    }

    if (!Array.isArray(groupNames) || groupNames.length === 0) {
      return res.status(500).json({
        message: "RBAC groups are not configured for this route",
      });
    }

    const missingGroups = groupNames.filter((groupName) => {
      // console.log("groupName", groupName);
      // console.log("ACCESS_CONFIG[groupName]", ACCESS_CONFIG[groupName]);
      return !ACCESS_CONFIG[groupName];
    });
    if (missingGroups.length > 0) {
      return res.status(500).json({
        message: `RBAC group is not configured: ${missingGroups.join(", ")}`,
      });
    }
    const isAllowed = groupNames.some((groupName) => {
      const allowedRoles = ACCESS_CONFIG[groupName];
      return allowedRoles.includes(userRole);
    });

    if (!isAllowed) {
      return res.status(403).json({
        message: "Forbidden: insufficient role",
      });
    }

    return next();
  };
}

module.exports = rbac_handler;