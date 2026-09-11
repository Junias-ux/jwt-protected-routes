import express from "express";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";

const PORT = process.env.PORT;
const app = express();

app.use(helmet());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Auth API is running" });
});

//Express v5 automatically forwards errors thrown inside async route handlers to the next error-handling middleware - no try/catch is needed in the route handlers themselves.

// Add an Express error handler to index.js after all route mounts that responds with the error status or 500, and the error message as { "error": err.message }.
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});

//Your authentication API is complete. The "start" script loads .env with node --env-file .env, so PORT and JWT_SECRET are available. Start the server:

/*
Request	Expected
POST /api/auth/register	201 + a token
POST /api/auth/login	200 + a token
GET /api/auth/profile (no token)	401
GET /api/auth/profile (valid token)	200 + the user
GET /api/admin/users (user token)	403
GET /api/admin/users (admin token)	200 + users without passwordHash
POST /api/auth/logout then reuse token	200, then 401
Run Tests

*/
