import { Component, OnInit, Input } from '@angular/core';
import { TaskService } from './../task.service';
import { Task } from './../task';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-task-selector',
  templateUrl: './task-selector.component.html',
  styleUrls: ['./task-selector.component.css'],
  providers: [TaskService]
})
export class TaskSelectorComponent implements OnInit {

  tasks: Task[];

  @Input('group')
  public taskForm: FormGroup;

  constructor(private taskService: TaskService) { }

  ngOnInit() {    
    this.taskService.getTasks().then(tasks => this.tasks = tasks);    
  }

}
