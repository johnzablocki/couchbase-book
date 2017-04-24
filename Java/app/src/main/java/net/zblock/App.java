
package net.zblock;

import java.util.List;

import static spark.Spark.*;
import com.google.gson.Gson;


public class App 
{
    private static TaskService taskService = new TaskService();
    private static final String CONTENT_TYPE = "application/json";

    public static void main(String[] args) {
        Gson gson = new Gson();
        OKMessage ok = new OKMessage("OK");
        enableCORS("*", "GET,PUT,POST,DELETE,OPTIONS", "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin,");

        get("/task/:key", (req, res) -> {
            Task task = taskService.getTask(req.params(":key"));
            return task; 
        }, gson::toJson);

        get("/tasks", (req, res) -> {
            List<Task> tasks = taskService.getTasks();
            return tasks; 
        }, gson::toJson);

        post("/create", CONTENT_TYPE, (req, res) -> {
            Task task = gson.fromJson(req.body(), Task.class);
            taskService.createTask(task);
            return ok;
        }, gson::toJson);

        post("/edit/:key", CONTENT_TYPE, (req, res) -> {
            Task task = gson.fromJson(req.body(), Task.class);
            taskService.updateTask(req.params(":key"), task);
            return ok;
        }, gson::toJson);

        post("/complete/:key", CONTENT_TYPE, (req, res) -> {
            taskService.completeTask(req.params(":key"));
            return ok;
        }, gson::toJson);

        post("/delete/:key", CONTENT_TYPE, (req, res) -> {            
            taskService.removeTask(req.params(":key"));
            return ok;
        }, gson::toJson);

        exception(Exception.class, (e, request, response) -> {
            response.status(500);
            response.body(e.getMessage());
        });
                
    }

    private static void enableCORS(final String origin, final String methods, final String headers) {

        options("/*", (request, response) -> {

            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", origin);
            response.header("Access-Control-Request-Method", methods);
            response.header("Access-Control-Allow-Headers", headers);
            // Note: this may or may not be necessary in your particular application
            response.type("application/json");
        });
    }    
}

