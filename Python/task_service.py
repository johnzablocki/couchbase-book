from .task import Task
from couchbase.bucket import Bucket
import uuid

class TaskService(object):

    def __init__(self):
        self._bucket = Bucket("couchbase://localhost/Tasks", password="qwerty")

    def get_tasks(self):
        rows = self._bucket.query("tasks", "all")
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
        self._bucket.insert(str(key), task)

    def update_task(self, task):
        self._bucket.upsert(task.id, task)

    def delete_task(self, key):
        self._bucket.remove(key)