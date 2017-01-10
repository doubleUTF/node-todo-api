const mongoose=require('mongoose');

mongoose.Promise=global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect('mongodb://genericUser:hahaha@ds161038.mlab.com:61038/todos')
module.exports={mongoose}
