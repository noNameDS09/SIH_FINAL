const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const priceRoutes = require('./routes/priceRoutes');
const errorHandler = require('./middlewares/errorHandler');
const priceRouteFuture = require('./routes/priceRoutesFuture')
const app = express();
const PORT = 3001;

// Connect to MongoDB
connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(authRoutes);
app.use(priceRoutes);
app.use(priceRouteFuture)
// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
