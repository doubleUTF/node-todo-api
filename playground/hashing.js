const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

var password='hahaha';

bcrypt.genSalt(10, (err,salt)=>{
  bcrypt.hash(password, salt, (err,hash)=>{
    console.log(hash);
  })
});

var hashedPassword='$2a$10$0NaArNR0Qv/C5WWT/sf7BuP8O7xQ9jAeHaql7T8Z5W/E/XzBWjALu';

bcrypt.compare('hahaha', hashedPassword,(err,res)=>{
  console.log(res)
})

// var message='the password';
// var hash=SHA256(message).toString();
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data={
//   id:4
// };
// var token={
//   data:data,
//   hash:SHA256(JSON.stringify(data)).toString()
// }
