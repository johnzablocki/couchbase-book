using System;
using Nancy;
using Newtonsoft.Json;
using Nancy.Extensions;
using Nancy.ModelBinding;

namespace Dotnet
{
    public class AppModule : NancyModule 
    {
        private readonly TaskService _taskService;

        public AppModule()
        {
            _taskService = new TaskService();
            var okMessage = new { status = "OK" };

            After += ctx => {
                ctx.Response.ContentType = "application/json";
            };

            Get("/", _ => {
                return "Hello, World!";
            });

            Get("/tasks", _ =>
            {
                var tasks = _taskService.GetTasks();
                return Response.AsJson(tasks);
            });

            Get("/task/{key}", parameters  => {
                var task = _taskService.GetTask(parameters.key.ToString());
                return Response.AsJson((Task)task);
            });

            Post("/create", _ => {
                var task = this.Bind<Task>();
                _taskService.CreateTask(task);
                return Response.AsJson(okMessage);
            });

            Post("/edit/{key}", parameters => {
                var task = this.Bind<Task>();
                _taskService.EditTask(parameters.key, task);
                return Response.AsJson(okMessage);
            });

            Post("/complete/{key}", parameters => {
                _taskService.CompleteTask(parameters.key);
                return Response.AsJson(okMessage);
            });

            Post("/delete/{key}", parameters => {
                _taskService.RemoveTask(parameters.key);
                return Response.AsJson(okMessage);
            });
        }
    }
}