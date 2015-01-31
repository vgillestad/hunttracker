using System;
using System.Collections.Generic;

namespace HuntTracker.Api.Interfaces.DataEntities
{
    public class Marker
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public List<string> Coordinates { get; set; }
    }
}