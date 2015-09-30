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
        public IEnumerable<Member> Members { get; set; }
    }

    public class Member
    {
        public string Id { get; set; }
        public TeamMemberStatus Status { get; set; }
    }

    public class MemberFull : User
    {
        public TeamMemberStatus Status { get; set; }
    }

    public enum TeamMemberStatus
    {
        Active, Deactivated, Invited, RequestingMembership
    }
    
}
