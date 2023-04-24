const express = require('express');
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const Tasks = require('./models/task');

const PORT = process.env.PORT ||  8080;

const app = express();
app.use(bodyparser.json());


app.post('/v1/tasks', async(req, res)=> {
   

    const task = await Tasks.create(req.body);

    if(task){
        res.json(task);
        res.status(200)
    }
    else{
        res.status(500)
        throw new Error('Book cannot be created')
    }
})

app.get('/v1/tasks', async(req, res)=> {
    const task = await Tasks.find();
    if(task){
        res.status(200).send(task);
    }
})

app.get('/v1/tasks/:id', async(req, res)=> {
    const task = await Tasks.findById(req.params.id)

    if(!task){
        res.status(401).json({error: "No Task Found"})
    }
    else{
        res.status(200).json(task);
    }
})

app.put('/v1/tasks/:id', async(req, res)=> {
    const task = await Tasks.findByIdAndUpdate(req.params.id, req.body);
    if(!task){
        res.status(401).json({error: "Task not found"})
    }
    else{
        res.status(200).send();
    }

})

app.delete('/v1/tasks/:id', async(req, res)=> {
    const task = await Tasks.findByIdAndDelete(req.params.id);
    if(!task){
        res.status(401).json({error:"No Task Found"})
    }
    else{
        res.status(200).send(task);
    }
})

// BULK ADD 

app.post('/v1/tasks/bulk', async(req, res)=> {
    const {tasks} = req.body;
    const taskArr = [];
    for(let task of tasks){
        const newTask = await Tasks.create(task);
        await newTask.save();
        taskArr.push({newTask});
    }
    res.status(200).json({tasks: taskArr})
})

app.delete('/v1/tasks/bulk', async(req, res)=> {

    const {tasks} = req.body;
    const taskIds = tasks.map(task => task.id);
    for(let i=0; i<taskIds.length; i++){
        const task= await Tasks.findOneAndDelete({id: taskIds[i]});
       if(!task){
        res.status(404).send({error: "Task not Found"})
       }
    }
    res.status(200);
})  


mongoose.connect('mongodb+srv://graut69:taskapi@cluster0.eriqhnl.mongodb.net/test')
.then(()=> {console.log("DB Connected")})
.catch((err)=> {console.log(err)});


app.listen(PORT, ()=> {
    console.log(`Server started at port ${PORT}`)
})

