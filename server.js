const express = require('express')
const assert = require('assert')
const { MongoClient, ObjectID } = require('mongodb')
const cors = require('cors');
const app = express()
app.use(cors())
app.use(express.json())
const Mongo_url = "mongodb://localhost:27017"
const dbName = "comments-api";

MongoClient.connect(Mongo_url, (err, client) => {
    assert.equal(err, null, 'DATA FAILED')
    const db = client.db(dbName)
    app.get('/', (req, res) => {
        res.send('from api')
    })
    app.get('/test', (req, res) => {
        res.send('test');
    })

    app.delete('/comments/:id', (req, res) => {
        // console.log(req)
        let id = ObjectID(req.params.id)
        console.log(id)
        db.collection('comments').findOneAndDelete({ _id: id }, (err, data) => {
            if (err) res.send('not found')
            else res.send(data)
        })
    })

    app.put('/comments/:id', (req, res) => {
        console.log("modify")
        // console.log(req)
        let id = ObjectID(req.params.id)
        let body = req.body;
        console.log(id)
        db.collection('comments').findOneAndUpdate({ _id: id }, {$set: body}, (err, data) => {
            if (err) res.send('not updated')
            else res.send(data)
        })
    })

    app.post('/comments', (req, res) => {
        const body = req.body;
        db.collection('comments').insertOne(body, (err, data) => {
            if (err) {
                res.status(400).json({ error: 'Error contact not inserted' })
            } else {
                res.json({ success: data.insertedId });
            }
        })
    })
    app.get('/comments/:id',(req,res)=>{
        let m=ObjectID(req.params.id)
        db.collection('comments').findOne({_id:m},(err,data)=>{
            if(err) res.send('errr ') 
            else res.send(data)
        })
    })
    app.get('/comments', (req, res) => {
        //  let  header=ObjectID(req.params.id)
        db.collection('comments').find().toArray((err, data) => {
            if (err) 
                res.send('not found')
             else 
                res.send(data)
            
        })
    })
})
app.listen(5000, (err) => {
    if (err) console.log('errr')
    else console.log('server run on 5000')
})