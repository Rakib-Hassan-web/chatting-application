const mongoose = require('mongoose');

const DB_URL=()=>{
   return mongoose.connect(process.env.DB_STRING)
  .then(() => console.log(' DB Connected!'));
}


module.exports=DB_URL