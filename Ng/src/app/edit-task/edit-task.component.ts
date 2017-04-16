import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from './../task';
import { TaskService } from './../task.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css'],
  providers: [TaskService]
})
export class EditTaskComponent implements OnInit, OnDestroy {

  taskId: string;
  task: Task;
  sub: any;
  editTaskForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private taskService: TaskService) {    
    this.createForm();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.taskId = params['id'];
      this.taskService.getTask(this.taskId).then(task => {
        this.task = task;
        this.editTaskForm.setValue({
          title: task.title,
          description: task.description || '',
          dueDate: task.dueDate || '',
          parentId: task.parentId || ''
        });
      });      
    });    
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit() : void {
    this.submitted = true;
    this.task = this.editTaskForm.value;
  }

  createForm() : void {
    
    var date = new Date();
    
    this.editTaskForm = this.fb.group({
      title: ['', Validators.required ],
      description: ['', Validators.required],
      dueDate: date.getMonth() + 3 + "/" + date.getDay() + 1 + "/" + date.getFullYear(),
      parentId: ''
    });

    this.editTaskForm.valueChanges
        .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) : void {
    if (! this.editTaskForm) { return; }
    const form = this.editTaskForm;
    
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
