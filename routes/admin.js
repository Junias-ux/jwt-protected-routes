import express from "express"; 
import authenticate from "../middleware/authenticate.js";
import authorizeRole from "../middleware/authorize.js";
import { readUsers } from "../utils/db.js";

const router = express.Router();
export default router;

//Add a GET /users route guarded by both authenticate and authorizeRole("admin"). The handler should map over readUsers() to strip the passwordHash from every user, then respond with { users }.
router.get("/users", authenticate, authorizeRole("admin"), (req, res) => {
    const rawUsers = readUsers();
    // Map over users and destructure passwordHash out of each user object
    const users = rawUsers.map(({ passwordHash, ...user }) => user);
    res.status(200).json({ users });
});