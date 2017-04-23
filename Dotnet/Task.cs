using System;
using Newtonsoft.Json;

namespace Dotnet
{
    public class Task
    {        
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("dueDate")]
        public DateTime DueDate { get; set; }

        [JsonProperty("isComplete")]
        public bool IsComplete { get; set; }

        [JsonProperty("parentId")]
        public string ParentId { get; set; }

        [JsonProperty("type")]
        public string Type { get { return "task"; } }

    }
}
