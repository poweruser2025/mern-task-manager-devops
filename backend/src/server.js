const dotenv = require("dotenv");

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.prod"
    : ".env.dev";

dotenv.config({ path: envFile });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch(err => {
    console.error('DB connection failed', err);
    process.exit(1);
  });
