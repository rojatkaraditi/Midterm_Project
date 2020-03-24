const express = require("express");
const routes = require("./routes/routes");
const bodyParser = require("body-parser");
const swaggerJsDocs = require('swagger-jsdoc');
swaggerUi = require('swagger-ui-express');
swaggerDocument = require('./swagger.json');
const cors = require('cors');

//all middleware required for application
app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());

var port = 3000;
var version = "v1";

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//routes of api available
app.use('/api/'+version,routes);

//listening on port 3000 for requests
app.listen(port,()=>{
    console.log("Listening on port: "+port);
})