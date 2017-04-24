package main

import "time"

type Task struct {
	Id string `json:"id,omitempty"`
	Title string `json:"title"`
	Description string `json:"description"`
	IsComplete bool `json:"isComplete"`	
	ParentId string `json:"parentId"`
	Type string `json:"type"`
	DueDate time.Time `json:"dueDate"`
}
