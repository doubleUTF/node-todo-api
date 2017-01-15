const expect=require('expect');
const request=require('supertest');
const {ObjectID}= require('mongodb');

const {User}= require('./../models/user');
const {app}=require('../server');
const {Todo}=require('../models/todo');
const {todos, populateTodos, users, populateUsers} =require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos',()=>{
  it('should create a new todo',(done)=>{
    var text='test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err,res)=>{
        if (err){
          return done(err);
        }
        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err)=>done(err));
      })
  })

  it('should not create todo with invalid body data',(done)=>{
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err,res)=>{
        if (err){
          return done(err)
        }

        Todo.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done()
        }).catch((err)=>done(err));
      })
  })
})

describe('GET /todos', ()=>{
  it('should get all todos', (done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  })
})

describe('GET /todos/:id', ()=>{
  it('should return todo doc', (done)=>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found',(done)=>{
    var todoID=new ObjectID().toHexString()
    request(app)
      .get(`/todos/${todoID}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if invalid id',(done)=>{
    request(app)
      .get('/todos/bullshitID')
      .expect(404)
      .end(done);
  })
})

describe('DELETE /todos/:id',()=>{
  it('should remove a todo', (done)=>{
    var hexId=todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err,res)=>{
        if (err){
          return done(err);
        }

        Todo.findById(hexId).then((todo)=>{
          expect(todo).toNotExist();
          done();
        }).catch((err)=>done(err));

        // query database using findById toNotExist assertion
        // expect(null).toNotExist();
      })
  });

  it('should return 404 if todo not found',(done)=>{
    var todoID=new ObjectID().toHexString()
    request(app)
      .delete(`/todos/${todoID}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done)=>{
    request(app)
      .delete('/todos/bullshitID')
      .expect(404)
      .end(done);
  })
})

describe('PATCH /todos/:id', ()=>{
  it('should update the todo', (done)=>{
    var sampleID=todos[1]._id.toHexString();
    var newTodo={
      text:'Winner winner',
      completed:true
    };
    request(app)
      .patch(`/todos/${sampleID}`)
      .send(newTodo)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.completedAt).toBeA('number');
        expect(res.body.todo.text).toBe(newTodo.text);
        expect(res.body.todo.completed).toBe(true);
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done)=>{
    var sampleID=todos[0]._id.toHexString();
    var newTodo={
      text:'Unfinished business',
      completed:false
    };

    request(app)
      .patch(`/todos/${sampleID}`)
      .send(newTodo)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.completedAt).toNotExist();
        expect(res.body.todo.text).toBe(newTodo.text);
        expect(res.body.todo.completed).toBe(false);
      })
      .end(done)
  })
});

describe('GET /users/me', ()=>{
  it('should return user if authenticated',(done)=>{
    request(app)
    .get('/users/me')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated', (done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({})
    })
    .end(done);
  })
})

describe('POST /users',()=>{
  var email='example@jjj.com';
  var password='123fggg';

  it('should create a user',(done)=>{
    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    })
    .end((err)=>{
      if (err){
        return done(err);
      }
      User.findOne({email}).then((user)=>{
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done()
      }).catch((e)=>done(e));
    })
  });

  it('should return validation errors if request invalid',(done)=>{
    request(app)
    .post('/users')
    .send({email:'badEmail',password:'bad'})
    .expect(400)
    .end(done);
  });

  it('should not create user if email in use',(done)=>{
    request(app)
    .post('/users')
    .send({email,password})
    .end((err)=>{
      if (err){
        return done(err);
      }
      request(app)
      .post('/users')
      .send({email,password})
      .expect(400);
      done();
    });
  });
})

describe('POST /users/login', ()=>{
  it('should login user and return auth token',(done)=>{
    request(app)
    .post('/users/login')
    .send({
      email:users[1].email,
      password:users[1].password
    })
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toExist();
    })
    .end((err,res)=>{
      if (err) return done(err);
      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens[0]).toInclude({
          access:'auth',
          token:res.headers['x-auth']
        });
        done();
      }).catch((e)=>done(e));
    })
  });

  it('should reject invalid login', (done)=>{
    request(app)
    .post('/users/login')
    .send({
      email:users[1].email,
      password:'bullshit'
    })
    .expect(400)
    .expect((res)=>{
      expect(res.header['x-auth']).toNotExist()
    })
    .end((err,res)=>{
      if (err) return done(err);
      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e)=>done(e))
    })
  })
})

describe('DELETE /users/me/token',()=>{
  it('should remove auth token on logout', (done)=>{
    request(app)
    .delete('/users/me/token')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .end((err,res)=>{
      if (err) return done(err);
      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e)=>done(e))
    });
  })
})
