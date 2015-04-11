using System;
using System.Collections.Generic;

namespace HuntTracker.Api.Interfaces.DataEntities
{
    public class Marker
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public List<string> Coordinates { get; set; }
        public string Description { get; set; }
        public DateTime DateTime { get; set; }
        public string Icon { get; set; }
    }
}