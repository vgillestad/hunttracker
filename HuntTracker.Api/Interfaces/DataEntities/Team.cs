using Newtonsoft.Json;
using System.Collections.Generic;

namespace HuntTracker.Api.Interfaces.DataEntities
{
    public class Team
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public IEnumerable<string> MemberIds { get; set; }
    }

    public class Member
    {
        public string Id { get; set; }
        public bool Active { get; set; }
    }
}
