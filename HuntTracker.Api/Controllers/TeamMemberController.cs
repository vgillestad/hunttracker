using System.Threading.Tasks;
using System.Web.Http;
using HuntTracker.Api.Interfaces.DataAccess;
using HuntTracker.Api.Interfaces.DataEntities;
using System.Collections.Generic;

namespace HuntTracker.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/teams/{teamId}/members")]
    public class TeamMemberController : ApiController
    {
        private readonly ITeamRepository _teamRepository;

        public TeamMemberController(ITeamRepository markerRepository)
        {
            _teamRepository = markerRepository;
        }

        [HttpGet]
        [Route("")]
        public async Task<IEnumerable<User>> GetMembers([FromUri] string teamId)
        {
            return null;            
        }

        [HttpPost]
        [Route("")]
        public async Task AddMember(
            [FromUri] string teamId,
            [FromBody] User member)
        {
        }

        [HttpDelete]
        [Route("{memberId}")]
        public async Task RemoveMember(
            [FromUri] string teamId,
            [FromUri] string memberId)
        {
        }

        [HttpPut]
        [Route("{memberId}/activate")]
        public async Task ActiveMember(
            [FromUri] string teamId,
            [FromUri] string memberId)
        {
        }

        [HttpPut]
        [Route("{memberId}/deactivate")]
        public async Task DeactiveMember(
            [FromUri] string teamId,
            [FromUri] string memberId)
        {
        }
    }
}
