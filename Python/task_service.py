from .task import Task
from couchbase.bucket import Bucket
import uuid

class TaskService(object):

    def __init__(self):
        self._bucket = Bucket("couchbase://localhost/Tasks", password="qwerty")

    def get_tasks(self):
        rows = self._bucket.query("tasks", "all", stale=False)
        tasks = []
        for row in rows:
            result = self._bucket.get(row.key)
            task = result.value
            task["id"] = row.key
            tasks.append(task)
        return tasks
    
    def get_task(self, key):
        task = self._bucket.get(key)
        return task.value

    def create_task(self, task):
        key = uuid.uuid1()
        task["type"] = "task"
        task["isComplete"] = False              
        self._bucket.insert(str(key), task)

    def update_task(self, key, task):
        if "id" in task:
            del task["id"]
        
        saved_task = self.get_task(key)
        saved_task["title"] = task["title"]
        saved_task["description"] = task["description"]
        saved_task["dueDate"] = task["dueDate"]
        saved_task["isComplete"] = task["isComplete"]
        saved_task["parentId"] = task["parentId"]

        self._bucket.upsert(key, saved_task)

    def delete_task(self, key):
        self._bucket.remove(key)

    def complete_task(self, key):
        saved_task = self.get_task(key)
        saved_task["isComplete"] = True
        self._bucket.upsert(key, saved_task)