package main

import (
	"fmt"
	"gopkg.in/couchbase/gocb.v1"
	"time"
	"github.com/google/uuid"
)

type TaskService struct {
	cluster *gocb.Cluster
	bucket *gocb.Bucket
}

func (ts *TaskService) initialize() {
	cluster, _ := gocb.Connect("couchbase://localhost")
    bucket, _ := cluster.OpenBucket("Tasks", "qwerty")	
	ts.bucket = bucket
	ts.cluster = cluster
}

func (ts *TaskService) getTask(key string) Task {

	var value interface{}
	ts.bucket.Get(key, &value)

	data := value.(map[string]interface{})
	task := Task{}
	task.Id = key
	task.Description = data["description"].(string)
	task.Title = data["title"].(string);
	task.IsComplete = data["isComplete"].(bool)
	task.DueDate, _ = time.Parse("2006-01-02T00:00:00", data["dueDate"].(string))

	return task
}

func (ts *TaskService) getTasks() []Task {

	query := gocb.NewViewQuery("tasks", "all")
	rows, _ := ts.bucket.ExecuteViewQuery(query)

	tasks := make([]Task, 0)
	var row interface{}
	for rows.Next(&row) {
		
		doc, _ := (row).(map[string]interface{})
		
		var value interface{}
		ts.bucket.Get(doc["key"].(string), &value)

		data := value.(map[string]interface{})
		task := Task{}
		task.Id = doc["key"].(string)
		task.Description = data["description"].(string)
		task.Title = data["title"].(string);
		task.IsComplete = data["isComplete"].(bool)
		task.DueDate, _ = time.Parse("2006-01-02T00:00:00", data["dueDate"].(string))

		tasks = append(tasks, task)
					
	}

	return tasks
}

func (ts *TaskService) createTask(task Task) {
	uuid, _ := uuid.NewRandom()		
	task.Type = "task"
	task.IsComplete = false		
	_, err := ts.bucket.Insert(uuid.String(), task, 0)
	fmt.Printf("%s", err)
}

func (ts *TaskService) editTask(key string, task Task) {
	savedTask := ts.getTask(key)

	savedTask.Title = task.Title
	savedTask.Description = task.Description
	savedTask.IsComplete = task.IsComplete
	savedTask.DueDate = task.DueDate
	savedTask.ParentId = task.ParentId
	
	_, err := ts.bucket.Upsert(key, task, 0)
	fmt.Printf("%s", err)
}

func (ts *TaskService) completeTask(key string) {
	savedTask := ts.getTask(key)
	savedTask.IsComplete = true
	_, err := ts.bucket.Upsert(key, savedTask, 0)
	fmt.Printf("%s", err)
}

func (ts *TaskService) deleteTask(key string) {
	var value interface{}
	ts.bucket.Get(key, &value)

	_, err := ts.bucket.Remove(key, 0)
	fmt.Printf("%s", err)
}
