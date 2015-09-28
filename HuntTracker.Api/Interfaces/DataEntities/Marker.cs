using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace HuntTracker.Api.Interfaces.DataEntities
{
    public class Marker
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        public string UserId { get; set; }
        public List<string> Coordinates { get; set; }
        public string Description { get; set; }
        public DateTime DateTime { get; set; }
        public string Icon { get; set; }
        public IEnumerable<string> SharedWithTeamIds { get; set; }
    }
}