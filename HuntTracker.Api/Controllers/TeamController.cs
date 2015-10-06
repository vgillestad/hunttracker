using System.Threading.Tasks;
using System.Web.Http;
using HuntTracker.Api.Interfaces.DataAccess;
using HuntTracker.Api.Interfaces.DataEntities;
using System.Collections.Generic;

namespace HuntTracker.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/teams")]
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
        [Route("")]
        public async Task<IEnumerable<Team>> GetTeamsByUser([FromUri] string userId)
        {
            return await _teamRepository.GetByUserAsync(userId);
        }

        [HttpPost]
        [Route("")]
        public async Task Post([FromBody] Team team)
        {
            await _teamRepository.InsertAsync(team);
            await _teamRepository.AddUserAsMember(team.Id, team.AdminId, TeamMemberStatus.Admin);
        }

        [HttpPut]
        [Route("")]
        public async Task Put([FromBody] Team update)
        {
            await _teamRepository.UpdateAsync(update);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task Delete([FromUri] string id)
        {
            await _teamRepository.DeleteAsync(id);
        }
    }
}
