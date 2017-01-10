const {mongoose}=require('../server/db/mongoose');
const {Todo}= require('../server/models/todo');
const {ObjectID}= require('mongodb');
const {User}= require('../server/models/user');

var userID='58745e67811cb32220123606'

User.findById(userID).then((user)=>{
  if (!user){
    return console.log('User not found')
  }
  console.log('User: ',user)
}, (err)=>{
  console.log(err);
}).catch((err)=>{
  console.log(err);
})

// var id='587508606555bd1f441358aa11';
//
// if (!ObjectID.isValid(id)){
//   console.log('ID invalid');
// }
// Todo.find({
//   _id:id
// }).then((todos)=>{
//   console.log('Todos',todos);
// });
//
// Todo.findOne({
//   _id:id
// }).then((todo)=>{
//   console.log('Todo',todo);
// });

// Todo.findById(id).then((todo)=>{
//   if (!todo){
//     return console.log('Id not found');
//   }
//   console.log('Todo by id',todo);
// }).catch((e)=>console.log(e));
