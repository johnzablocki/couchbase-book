var express = require('express');
var cors = require('cors');
var reload = require('reload');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();
app.use([cors(), bodyParser.json()]);


var TaskService = require('./taskService.js');
var taskService = new TaskService();

app.set('port', process.env.PORT || 3000)

app.get('/', function(req, resp) {
    resp.send('Hello, Couchbase world!');
});

app.get('/task/:key', async function(req, resp) {
    resp.send(await taskService.getTask(req.params.key))
}); 

app.get('/tasks', async function(req, resp) {
    resp.send(await taskService.getTasks());
});

app.post('/create', async function(req, resp) {
    await taskService.createTask(req.body)
        .then(resp.send({ 'status' : 'ok' }))
        .catch(e => console.log(e));
});

app.post('/edit/:key', async function(req, resp) {
    await taskService.editTask(req.params.key, req.body)
        .then(resp.send({ 'status' : 'ok' }))
        .catch(e => console.log(e));
});

app.post('/complete/:key', async function(req, resp) {
    await taskService.completeTask(req.params.key)
        .then(resp.send({ 'status' : 'ok' }))
        .catch(e => console.log(e));
});

app.post('/delete/:key', async function(req, resp) {
    await taskService.deleteTask(req.params.key)
        .then(resp.send({ 'status' : 'ok' }))
        .catch(e => console.log(e));
});

var server = http.createServer(app);
reload(server, app);

server.listen(app.get('port'), function() {
    console.log('Lisening on port ' + app.get('port'));
});
