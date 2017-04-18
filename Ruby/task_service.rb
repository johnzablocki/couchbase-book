require 'couchbase'
require 'securerandom'

class TaskService
    
    def initialize()
        @bucket = Couchbase.connect(:bucket => 'Tasks', :password => 'qwerty')
        @view = @bucket.design_docs['tasks']
    end

    def get_tasks()
        tasks = []
        @view.all.each do |doc|
            task = @bucket.get(doc.key)
            task['id'] = doc.key
            tasks.push(task)
        end
        tasks
    end

    def get_task(key)
        task = @bucket.get(key)
        task
    end

    def create_task(task)
        key = SecureRandom.uuid
        task["type"] = "task"
        task["isComplete"] = false               
        @bucket.set(key, task)
    end 

    def update_task(key, task)
        
        saved_task = @bucket.get(key)
        saved_task["title"] = task["title"]
        saved_task["description"] = task["description"]
        saved_task["dueDate"] = task["dueDate"]
        saved_task["isComplete"] = task["isComplete"]
        saved_task["parentId"] = task["parentId"]

        @bucket.set(key, saved_task)
    end

    def delete_task(key)
        @bucket.delete(key)
    end

    def complete_task(key)
        saved_task = @bucket.get(key)
        saved_task["isComplete"] = true
        @bucket.set(key, saved_task)
    end
end