import express from "express";
import {findByEmail, readUsers, writeUsers } from "../utils/db.js";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import {signToken} from "../utils/jwt.js";
import authenticate from "../middleware/authenticate.js";
import { blacklistToken } from "../utils/token-blacklist.js";

const router = express.Router();
export default router;

router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    const existingUser = findByEmail(email);
    if (existingUser) {
        return res.status(409).json({ message: "User already exists || Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const users = readUsers();
    const newUser = {
        id: randomUUID(),
        email,
        passwordHash,
        role: "user"
    }
    users.push(newUser);
    writeUsers(users);

    const token = signToken({ id: newUser.id, email: newUser.email, role: newUser.role });
    res.status(201).json({ message: "User registered successfully", token });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    const user = findByEmail(email);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.status(200).json({ message: "Login successful", token });
});

router.get("/profile", authenticate, (req, res) => {
    res.status(200).json({ user: req.user });
});

//Protect the route with authenticate. In the handler, read the token from the Authorization header (split on the space and take the second part), pass it to blacklistToken, and respond with a JSON message (for example "Logged out successfully").
router.post("/logout", authenticate, (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    blacklistToken(token);
    res.status(200).json({ message: "Logged out successfully" });
});