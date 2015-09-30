using System.Threading.Tasks;
using System.Web.Http;
using HuntTracker.Api.Interfaces.DataAccess;
using HuntTracker.Api.Interfaces.DataEntities;
using System.Collections;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;

namespace HuntTracker.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/teams")]
    public class TeamController : ApiController
    {
        private readonly ITeamRepository _teamRepository;

        public TeamController(ITeamRepository markerRepository)
        {
            _teamRepository = markerRepository;
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
        }

        [HttpPut] //Expecting whole team - including member ids
        [Route("")]
        public async Task Put([FromBody] Team update)
        {
            await _teamRepository.UpdateAsync(update);
        }

        [HttpPatch] //Just name and description - not including member ids
        [Route("")]
        public async Task Patch([FromBody] Team update)
        {
            var current = await _teamRepository.GetByIdAsync(update.Id);
            current.Name = update.Name;
            current.Description = update.Description;
            await _teamRepository.UpdateAsync(current);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task Delete([FromUri] string id)
        {
            await _teamRepository.DeleteAsync(id);
        }
    }
}
