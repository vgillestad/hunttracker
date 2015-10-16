using System.Threading.Tasks;
using System.Web.Http;
using HuntTracker.Api.Interfaces.DataAccess;
using HuntTracker.Api.Interfaces.DataEntities;
using System.Collections.Generic;
using HuntTracker.Api.Context;

namespace HuntTracker.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api")]
    public class TeamController : ApiController
    {
        private readonly ITeamRepository _teamRepository;
        private readonly IUserRepository _userRepository;

        public TeamController(ITeamRepository markerRepository, IUserRepository userRepository)
        {
            _teamRepository = markerRepository;
            _userRepository = userRepository;
        }

        [HttpGet]
        [Route("me/teams")]
        public async Task<IEnumerable<Team>> GetMyTeams([FromUri] bool activeOnly = false)
        {
            return await _teamRepository.GetByUserAsync(Me.Id(), activeOnly);
        }

        [HttpPost]
        [Route("teams")]
        public async Task Post([FromBody] Team team)
        {
            await _teamRepository.InsertAsync(team);
            await _teamRepository.AddUserAsMember(team.Id, team.AdminId, TeamMemberStatus.Admin);
        }

        [HttpPut]
        [Route("teams")]
        public async Task Put([FromBody] Team update)
        {
            await _teamRepository.UpdateAsync(update);
        }

        [HttpDelete]
        [Route("teams/{id}")]
        public async Task Delete([FromUri] string id)
        {
            await _teamRepository.DeleteAsync(id);
        }
    }
}
