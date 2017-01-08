// const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').deleteMany({text:'Make lunch'}).then((result)=>{
  //   console.log(result);
  // })

  db.collection('Users').findOneAndDelete({_id:new ObjectID("58726faad646721d3cec815e")})
  .then((result)=>{
    console.log(result)
  })

  db.collection('Users').deleteMany({name:'Jh0n'}).then((result)=>{
    console.log(result)
  })
  // db.close()
});
