using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Couchbase;
using Couchbase.Configuration.Client;
using Couchbase.Core.Serialization;
using System.Collections.Generic;
using System.Linq;
using Couchbase.Core;
using System.Reflection;

namespace Dotnet
{
    public class TaskService
    {
        private static readonly IBucket _bucket;

        static TaskService() 
        {
            var config = new ClientConfiguration
            {
                Servers = new List<Uri>
                {
                    new Uri("http://localhost/pools")
                },
                BucketConfigs = new Dictionary<string, BucketConfiguration>
                {
                    {"Tasks", new BucketConfiguration {
                        BucketName = "Tasks",
                        Password = "qwerty"
                    }}
                },
                Serializer = () =>
                {
                    return new DefaultSerializer(
                        new JsonSerializerSettings(),
                        new JsonSerializerSettings()
                        {
                            ContractResolver = new DocumentIdContractResolver()   
                        });
                }
            };
            _bucket = new Cluster(config).OpenBucket("Tasks");
        }             

        public IEnumerable<Task> GetTasks()
        {
            var query = _bucket.CreateQuery("tasks", "all");
            var rows = _bucket.Query<Task>(query).Rows;

            var tasks = new List<Task>();
            foreach (var row in rows)
            {
                var task = _bucket.GetDocument<Task>(row.Key).Content;                
                task.Id = row.Key;
                tasks.Add(task);
            }

            return tasks;
        }

        public Task GetTask(string key) 
        {
            var task = _bucket.GetDocument<Task>(key);
            return task.Content;
        }

        public void CreateTask(Task task)
        {
            var key = Guid.NewGuid().ToString();
            _bucket.Insert(new Document<Task> {
                Id = key,
                Content = task
            });
        }

        public void EditTask(string key, Task task)
        {
            var savedTask = _bucket.GetDocument<Task>(key).Content;
            savedTask.Title = task.Title;
            savedTask.Description = task.Description;
            savedTask.IsComplete = task.IsComplete;
            savedTask.DueDate = task.DueDate;
            savedTask.ParentId = task.ParentId;
            _bucket.Replace(new Document<Task> {
                Id = key,
                Content = savedTask
            });
        }

        public void CompleteTask(string key)
        {
            var savedTask = _bucket.GetDocument<Task>(key).Content;
            savedTask.IsComplete = true;
            _bucket.Replace(new Document<Task> {
                Id = key,
                Content = savedTask
            });
        }

        public void RemoveTask(string key)
        {
            _bucket.Remove(key);
        }

        private class DocumentIdContractResolver : CamelCasePropertyNamesContractResolver
        {
            protected override List<MemberInfo> GetSerializableMembers(Type objectType)
            {
                return base.GetSerializableMembers(objectType).Where(o => o.Name != "Id").ToList();
            }
        }
    }
}