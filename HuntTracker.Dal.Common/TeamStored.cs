using HuntTracker.Api.Interfaces.DataEntities;
using System.Collections.Generic;

namespace HuntTracker.Dal.Common
{
    public class TeamStored : Team
    {
        public IEnumerable<MemberStored> Members { get; set; }

        public TeamStored()
        {
            Members = new List<MemberStored>();
        }
    }
}
