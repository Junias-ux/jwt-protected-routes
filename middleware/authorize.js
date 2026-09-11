//In middleware/authorize.js, default-export a function authorizeRole(role) that returns a middleware function. This pattern - a function that returns middleware - lets you configure the middleware per route, e.g. authorizeRole("admin").

/*export default function requireSomething(value) {
  return (req, res, next) => {};
}*/
//The returned middleware should respond with status 403 and a JSON message such as "Access denied" when there is no req.user or the user's role does not match role. Otherwise it should call next().

export default function authorizeRole(role) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: "Forbidden: You do not have the required role || Access denied" });
        }
        next();
    };
}