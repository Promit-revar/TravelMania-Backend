const express = require('express');
require('dotenv').config();
const router = require("./routes/web");
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const port = process.env.PORT || 8000;
app.listen(port,()=>console.log(`server running on port: ${port}`));