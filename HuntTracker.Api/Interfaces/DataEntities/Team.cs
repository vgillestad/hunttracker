using Newtonsoft.Json;
using System.Collections.Generic;

namespace HuntTracker.Api.Interfaces.DataEntities
{
    public class Team
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        public string AdminId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class Member
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public TeamMemberStatus Status { get; set; }
    }

    public enum TeamMemberStatus
    {
        Admin = 0,
        Active = 1,
        Paused = 2,
        Invited = 3,
        RequestingMembership = 4 
    }
    
}
