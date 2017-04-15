import { Component, OnInit } from '@angular/core';
import { Task } from './../task';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  tasks: Array<Task>;

  constructor() { 
    this.tasks = [
      new Task('Pick up the almond milk', '1'),
      new Task('Return the videos to Blockbuster', '2'),
      new Task('Walk the dog', '3')
    ];
  }

  ngOnInit() {
  }

}
