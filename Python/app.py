from flask import Flask, render_template, request, jsonify
from flask_cors import CORS, cross_origin
from .task_service import TaskService
import json

task_service = TaskService()
app = Flask(__name__)
CORS(app)

@app.route('/')
def main():
    return 'hello'

@app.route('/task/<key>', methods=['get'])
def get(key):
    task = task_service.get_task(key)    
    return jsonify(task)

@app.route('/tasks', methods=['get'])
def get_all():
    tasks = task_service.get_tasks()
    return jsonify(tasks)

@app.route('/create', methods=['post'])
def create(): 
    task = request.get_json()
    task_service.create_task(task)        
    return jsonify({'status': 'OK'})