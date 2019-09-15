var express = require('express');
var queryRepository = require('./queryRepository');
var cors = require('cors');
var bodyParser = require('body-parser')

let port = 3001;
//init app express
var app = express();
// For POST-Support
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(cors());


app.get('/updateRepository', function (req, res) {
  let commit = queryRepository.getPull();
    commit.then(data =>{
      if (data) throw data;
      return res.send('0k');
    })
    .catch(e => {
      return res.status(404).send(e);
    })
});

app.post('/commits', function (req, res) {
  let commit = queryRepository.getCommit(req.body.cantHistorys);
  commit.then(data =>{
    
    if (data.error) throw data;
    return res.send(data);
  })
  .catch (e =>{
    return res.status(404).send(e);
  })
});


app.post('/commitsFile', function (req, res) {
  let commit = queryRepository.getCommitByFiles(req.body.file, req.body.cantHistorys);
  commit.then(data =>{
    if (data.error) throw data;
    return res.send(data);
  })
  .catch (e =>{
    return res.status(404).send(e);
  })
});

app.post('/commitsAuthor', function (req, res) {
  let commit = queryRepository.getCommitByAuthor(req.body.author, req.body.cantHistorys);
  commit.then(data =>{
    if (data.error) throw data;
    return res.send(data);
  })
  .catch (e =>{
    return res.status(404).send(e);
  })
});
app.listen(port, async function () {
  console.log('nodeGitLog run on port 3001!');
});
