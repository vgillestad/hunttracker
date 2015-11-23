using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections;
using System.Collections.Generic;

namespace HuntTracker.Api.Interfaces.DataEntities
{
    public class User
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public Settings Settings { get; set; }
        public IDictionary<string, Filter> Filters { get; set; }
    }

    public class Settings
    {
        public string Filter { get; set; }
        public string Layer { get; set; }
    }

    public class Filter
    {
        public string Name { get; set; }
        public BasicFilter MineOnly { get; set; }
        public TeamFilter Team { get; set; }
        public TagFilter Tag { get; set; }
        public DateFilter FromDate { get; set; }
        public DateFilter ToDate { get; set; }
    }

    public class BasicFilter
    {
        public bool Enabled { get; set; }
    }

    public class TeamFilter : BasicFilter
    {
        public IEnumerable<string> Teams { get; set; }
    }

    public class TagFilter : BasicFilter
    {
        public IEnumerable<string> Tags { get; set; }
    }

    public class DateFilter : BasicFilter
    {
        public string Date { get; set; }
    }
}
