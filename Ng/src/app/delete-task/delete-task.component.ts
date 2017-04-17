import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from './../task';
import { TaskService } from './../task.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-task',
  templateUrl: './delete-task.component.html',
  styleUrls: ['./delete-task.component.css'],
  providers:[TaskService]
})
export class DeleteTaskComponent implements OnInit {

  task: Task;
  taskId: string;
  sub: any;
  constructor(private taskService: TaskService, private router: Router, private route: ActivatedRoute) { 
    this.task = new Task('');
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.taskId = params['id'];
      this.taskService.getTask(this.taskId).then(task => this.task = task);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  cancel() {
    this.router.navigateByUrl('/tasks');
  }

  delete() {
    this.taskService.deleteTask(this.taskId);
    this.router.navigateByUrl('/tasks');
  }
}
