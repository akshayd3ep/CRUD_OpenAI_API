const mongoose = require('mongoose')


const dbConnection = async () => {
  try {
      await mongoose.connect(process.env.MONGODB_URI, { 
      dbName:process.env.DB_NAME,
  
    });
    console.log('connected');
  } catch (e) {
    console.log('error in db connection ' + e);
  }
}






module.exports = dbConnection