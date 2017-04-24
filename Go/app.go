package main

import (
	"fmt"
	"net/http"
	"github.com/daryl/zeus"	
	"github.com/rs/cors"
	"encoding/json"
)

type OKMessage struct {
	Status string `json:"status"`
}

var ts = TaskService{}
var message = OKMessage{}

func main() {
	ts.initialize()
	message.Status = "OK"
	
	mux := zeus.New()

	mux.GET("/", hello)
	mux.GET("/tasks", tasks)
	mux.GET("/task/:id", task)
	mux.POST("/create", create)
	mux.POST("/edit/:id", edit)
	mux.POST("/complete/:id", edit)
	mux.POST("/delete/:id", edit)
	
	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":4545", handler)
	fmt.Println("Listening on port 4545")
}

func hello(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("Hello, world!"))
}

func tasks(w http.ResponseWriter, r *http.Request) {
	tasks := ts.getTasks()
	j, _ := json.Marshal(tasks)	
	w.Write([]byte(j))
}

func task(w http.ResponseWriter, r *http.Request) {
	key := zeus.Var(r, "id")
	task := ts.getTask(key)
	j, _ := json.Marshal(task)
	w.Write([]byte(j))
}

func create(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var task Task
	decoder.Decode(&task)

	ts.createTask(task)
	fmt.Println(task)
	r.Body.Close()
	j, _ := json.Marshal(message)
	setHeader(w)
	w.Write([]byte(j))
}

func edit(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var task Task
	decoder.Decode(&task)

	key := zeus.Var(r, "id")
	ts.editTask(key, task)
	r.Body.Close()
	
	j, _ := json.Marshal(message)
	setHeader(w)
	w.Write([]byte(j))
}

func complete(w http.ResponseWriter, r *http.Request) {
	key := zeus.Var(r, "id")
	ts.completeTask(key)
	
	j, _ := json.Marshal(message)
	setHeader(w)
	w.Write([]byte(j))
}

func delete(w http.ResponseWriter, r *http.Request) {
	key := zeus.Var(r, "id")
	ts.deleteTask(key)
	
	j, _ := json.Marshal(message)
	setHeader(w)
	w.Write([]byte(j))
}

func setHeader(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
}