const couchbase = require('couchbase');
const ViewQuery = couchbase.ViewQuery;
const uuidV4 = require('uuid/v4');


module.exports = class TaskService {
    
    constructor() {
        let cluster = new couchbase.Cluster('couchbase://localhost');        
        this.bucket = cluster.openBucket('Tasks', 'qwerty');
    }

    async getTask(key) {
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                self.bucket.get(key, function(err, result) {
                    let task = result.value;
                    resolve(task);
                });
            } catch (e) {
                reject(e);
            }      
            
        });
    }

    async getTasks() {
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                let view = ViewQuery.from('tasks', 'all');
                self.bucket.query(view, function(err, results) {
                    var keys = results.map(x => x.key);                    
                    self.getTasksMulti(keys)
                         .then(tasks => resolve(tasks))
                         .catch(e => console.log(e));
                });            
            } catch (e) {
                reject(e);
            }
        });            
    }

    async getTasksMulti(keys) {
        var self = this;        
        return new Promise(function(resolve, reject) {
            try {
                self.bucket.getMulti(keys, function(err, results) {
                let tasks = [];
                for(var key in results) {
                    var task = results[key].value;
                    task.id = key;
                    tasks.push(task);
                }
                resolve(tasks);
                });
            } catch (e) {
                reject(e);
            }

        });
    }

    async createTask(task) {
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                let key = uuidV4();
                task.type = "task";
                self.bucket.insert(key, task, function(err, result) {
                    resolve('OK');
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    async editTask(key, task) {
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                 self.get_task(key)
                    .then(savedTask => {
                        savedTask.title = task.title;
                        savedTask.description = task.description;
                        savedTask.dueDate = task.dueDate;
                        savedTask.isComplete = task.isComplete;
                        savedTask.parentId = task.ParentId;
                        self.bucket.upsert(key, savedTask, function(err, result) {
                            resolve('OK');
                        });
                    })
                    .catch(e => console.log(e));                
            } catch (e) {
                reject(e);
            }
        });
    }

    async completeTask(key) {
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                self.getTask(key).then(task => {
                    task.isComplete = true;
                    self.bucket.upsert(key, task, function(err, result) {
                        resolve('OK');
                    });                    
                }).catch(e => console.log(e));
            } catch(e) {
                reject(e);
            }
        });
    }

    async deleteTask(key) {
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                self.bucket.remove(key, function(err, resp) {
                    resolve('OK');
                });
            } catch(e) {
                reject(e);
            }
        });
    }
}