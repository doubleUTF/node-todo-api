const mongoose=require('mongoose');

mongoose.Promise=global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect(process.env.PORT ? 'mongodb://genericUser:hahaha@ds161038.mlab.com:61038/todos': 'mongodb://localhost:27017/TodoApp')
module.exports={mongoose}
