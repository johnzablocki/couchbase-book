import { Component, OnInit } from '@angular/core';
import { Task } from './../task';
import { TaskService } from './../task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  providers: [TaskService]
})
export class TaskListComponent implements OnInit {

  tasks: Task[];

  constructor(private taskService: TaskService, private router: Router) {     
  }

  ngOnInit() {    
    this.getTasks();
  }

  completeTask(id: string) : void {
    this.taskService.completeTask(id).then(status => this.getTasks())
  }

  getTasks() : void {
    this.taskService.getTasks().then(tasks => this.tasks = tasks);
  }
}
