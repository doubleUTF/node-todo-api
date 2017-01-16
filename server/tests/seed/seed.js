const {ObjectID}= require('mongodb');
const {Todo}=require('../../models/todo');
const {User}= require('./../../models/user');
const jwt=require('jsonwebtoken');

const userOneId= new ObjectID();
const userTwoId= new ObjectID();
const users=[{
  _id: userOneId,
  email:'jh0n@jh0n.com',
  password:'crunked',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:userOneId,access:'auth'},process.env.JWT_SECRET)
  }]
},{
  _id:userTwoId,
  email:'hahah@qqq.com',
  password:'nopass',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:userTwoId,access:'auth'},process.env.JWT_SECRET)
  }]
}]

const todos=[{
  text:'First todo',
  _id: new ObjectID(),
  _creator: userOneId
}, {
  text:'Second todo',
  _id: new ObjectID(),
  completed:true,
  completedAt:1,
  _creator: userTwoId
}]

const populateTodos=(done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=>done());
};

const populateUsers=(done)=>{
  User.remove({}).then(()=>{
    var userOne= new User(users[0]).save();
    var userTwo= new User(users[1]).save();

    return Promise.all([userOne,userTwo])
  }).then(()=>done());
}

module.exports={
  todos,
  users,
  populateTodos,
  populateUsers
}
