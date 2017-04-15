import { Component, OnInit } from '@angular/core';
import { Task } from './../task';
import { TaskService } from './../task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  providers: [TaskService]
})
export class TaskListComponent implements OnInit {

  tasks: Task[];

  constructor(private taskService: TaskService) {     
  }

  ngOnInit() {
    this.taskService.getTasks().then(tasks => this.tasks = tasks);
  }

}
