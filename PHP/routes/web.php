<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

use Illuminate\Http\Request;

require('taskService.php');

$taskService = new TaskService;
$okMessage = ["status"=>'OK'];


$app->get('/', function () use ($app) {
    
    
    return 'Hello, world!';
});

$app->get('/tasks', function () use ($app, $taskService) {
        
    $tasks = $taskService->getTasks();
    
    return response()->json($tasks);
});

$app->get('/task/{id}', function ($id) use ($app, $taskService) {
        
    $task = $taskService->getTask($id);
    
    return response()->json($task);
});

$app->post('/create', function(Request $request) use ($app, $taskService, $okMessage) {
    $task = $request->json()->all();
    $taskService->createTask($task);
    return response()->json($okMessage);
});

$app->post('/edit/{id}', function(Request $request, $id) use ($app, $taskService, $okMessage) {
    $task = $request->json()->all();
    $taskService->updateTask($id, $task);
    return response()->json($okMessage);
});

$app->post('/complete/{id}', function($id) use ($app, $taskService, $okMessage) {    
    $taskService->completeTask($id);
    return response()->json($okMessage);
});

$app->post('/delete/{id}', function($id) use ($app, $taskService, $okMessage) {
    $taskService->deleteTask($id);
    return response()->json($okMessage);
});
