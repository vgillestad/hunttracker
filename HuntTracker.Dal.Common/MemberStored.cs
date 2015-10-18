using HuntTracker.Api.Interfaces.DataEntities;

namespace HuntTracker.Dal.Common
{
    public class MemberStored
    {
        public string UserId { get; set; }
        public TeamMemberStatus Status { get; set; }
    }
}
