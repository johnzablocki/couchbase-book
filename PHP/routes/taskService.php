<?php

class TaskService {
    
    private $bucket;

    function __construct() {
        global $bucket;

        $cluster = new CouchbaseCluster('couchbase://localhost');
        $bucket = $cluster->openBucket('Tasks', 'qwerty');
    }

    public function getTask($key) {
         global $bucket;
         $task = $bucket->get($key);
         return $task->value;
    }

    public function getTasks() {
         global $bucket;
         
         $query = CouchbaseViewQuery::from("tasks", "all");
         
         $tasks = array();
         $rows = $bucket->query($query);
         foreach($rows->rows as $row) {            
            $task = $this->getTask($row->key);
            $task->id = $row->key;
            array_push($tasks, $task);
         }
         
         return $tasks;
    }

    public function createTask($task) {
        $key = uniqid();
        $task["type"] = "task";
        $task["isComplete"] = false;

        global $bucket;
        $bucket->insert($key, $task);
    }

    public function updateTask($key, $task) {
        $savedTask = $this->getTask($key);
        $savedTask->title = $task["title"];
        $savedTask->description = $task["description"];
        $savedTask->dueDate = $task["dueDate"];
        $savedTask->isComplete = $task["isComplete"];
        $savedTask->parentId = $task["parentId"];

        global $bucket;
        $bucket->replace($key, $task);
    }

    public function completeTask($key) {
        $savedTask = $this->getTask($key);
        $savedTask->isComplete = true;

        global $bucket;
        $bucket->replace($key, $savedTask);
    }

    public function deleteTask($key) {

        global $bucket;
        $bucket->remove($key);
    }

}