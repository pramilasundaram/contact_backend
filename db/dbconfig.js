const mongoose=require('mongoose');

const db=process.env.DATABASE;
async function main() {
    try {
        const connect=await mongoose.connect(db);
    console.log('db connected:',connect.connection.host,connect.connection.name);  
    } catch (error) {
         console.log(error);  
    }
  }

  module.exports=main;
