const app = require('./app');
const port = process.env.PORT || 3000;
const dbconnection = require('./config/database');
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
  
  });
dbconnection();

app.listen(port , () =>{
    console.log(`Server is running on port ${port}`);
});