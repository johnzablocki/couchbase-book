import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from './../task';
import { TaskService } from './../task.service'
import { Router } from '@angular/router'
import * as moment from 'moment';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css'],
  providers: [TaskService]
})
export class NewTaskComponent implements OnInit {

  newTask = new Task('');
  newTaskForm: FormGroup;
  submitted = false;
  tasks: Task[];
  sub: any;

  constructor(private fb: FormBuilder, private router: Router, private taskService: TaskService) {
    this.createForm();
  }

  ngOnInit() {
    
  }

  onSubmit() : void {
    this.submitted = true;
    this.newTask = this.newTaskForm.value;
    this.taskService.createTask(this.newTask);
    this.router.navigateByUrl('/tasks');
  }

  createForm() : void {
    
    this.newTaskForm = this.fb.group({
      title: ['New task', Validators.required ],
      description: ['Task description', Validators.required],
      dueDate: moment().add(7, 'days').format('YYYY-MM-DD'),
      parent: ''
    });
    console.log(this.newTaskForm.value.dueDate);
    
    this.newTaskForm.valueChanges
        .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) : void {
    if (! this.newTaskForm) { return; }
    const form = this.newTaskForm;
    
    for(const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessage[field];
        for(const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }    
  }

  formErrors = {
    'title': '',
    'description': '',
    'dueDate': ''
  }

  validationMessage = {
    'title' : {
      'required' : 'Title is required'
    },
    'description' : {
      'required' : 'Description is required'
    }
  }  
}
