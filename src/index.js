const express = require('express');
const router = require('./routes/index.js');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4001;

// Apply cors
app.use(cors());

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use(router)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});