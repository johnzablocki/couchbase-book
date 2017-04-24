package net.zblock;

import java.util.List;
import java.util.ArrayList;
import java.util.UUID;

import com.couchbase.client.java.*;
import com.couchbase.client.java.document.*;
import com.couchbase.client.java.document.json.*;
import com.couchbase.client.java.query.*;
import com.couchbase.client.java.view.*;
import com.google.gson.Gson;

public class TaskService {

    private static Cluster cluster;
    private static Bucket bucket;

    private Gson gson = new Gson();

    public TaskService() {
        this.cluster = CouchbaseCluster.create("localhost");
        this.bucket = cluster.openBucket("Tasks", "qwerty");
    }

    public List<Task> getTasks() {
        ViewResult result = bucket.query(ViewQuery.from("tasks", "all"));
        List<Task> tasks = new ArrayList<Task>();
        for(ViewRow row : result) {
            Task task = getTask(row.id());
            task.setId(row.id());
            tasks.add(task);
        }
        return tasks;
    }

    public Task getTask(String key) {
        
        RawJsonDocument doc = bucket.get(key, RawJsonDocument.class);
        Task task = gson.fromJson(doc.content(), Task.class);
        return task;
    }

    public void createTask(Task task) {
        String key = UUID.randomUUID().toString();        
        task.setType("task");
        task.setIsComplete(false);
        String json = gson.toJson(task);
        
        RawJsonDocument doc = RawJsonDocument.create(key, json);
        bucket.insert(doc);
    }

    public void updateTask(String key, Task task) {
        Task savedTask = getTask(key);
        savedTask.setTitle(task.getTitle());
        savedTask.setDescription(task.getDescription());
        savedTask.setIsComplete(task.getIsComplete());
        savedTask.setParentId(task.getParentId());
        savedTask.setDueDate(task.getDueDate());
        
        String json = gson.toJson(savedTask);
        RawJsonDocument doc = RawJsonDocument.create(key, json);
        bucket.replace(doc);
    }

    public void completeTask(String key) {
        Task savedTask = getTask(key);
        savedTask.setIsComplete(true);
        
        String json = gson.toJson(savedTask);
        RawJsonDocument doc = RawJsonDocument.create(key, json);
        bucket.replace(doc);
    }

    public void removeTask(String key) {        
        bucket.remove(key);
    }

}