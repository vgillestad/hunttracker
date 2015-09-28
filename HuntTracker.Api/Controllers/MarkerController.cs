using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using HuntTracker.Api.Interfaces.DataAccess;
using HuntTracker.Api.Interfaces.DataEntities;

namespace HuntTracker.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/markers")]
    public class MarkerController : ApiController
    {
        private readonly IMarkerRepository _markerRepository;

        public MarkerController(IMarkerRepository markerRepository)
        {
            _markerRepository = markerRepository;
        }

        [HttpGet]
        [Route("")]
        public async Task<IEnumerable<Marker>> GetByUser([FromUri] string userId, bool includeTeamMarkers = true)
        {
            var markers = await _markerRepository.GetByUser(userId);
            return markers;
        }

        [HttpPost]
        [Route("")]
        public async Task<Marker> Post([FromBody] Marker marker)
        {
            await _markerRepository.InsertAsync(marker);
            return marker;
        }        

        [HttpPut]
        [Route("")]
        public async Task Put([FromBody] Marker update)
        {
            await _markerRepository.UpdateAsync(update);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task Delete([FromUri] string id)
        {
            await _markerRepository.DeleteAsync(id);
        }

        [HttpPut]
        [Route("{id}/sharewithteam/{teamId}")]
        public async Task ShareWithTeam(
            [FromUri] string id,
            [FromUri] string teamId)
        {   
        }

        [HttpPut]
        [Route("{id}/unsharewithteam/{teamId}")]
        public async Task UnShareWithTeam(
            [FromUri] string id,
            [FromUri] string teamId)
        {
        }
    }
}

//if (update.SharedWithTeamIds.Any() && current.SharedWithTeamIds.Any())
//{
//    var addedTeams = update.SharedWithTeamIds.Except(current.SharedWithTeamIds).ToList();
//    var removedTeams = current.SharedWithTeamIds.Except(update.SharedWithTeamIds).ToList();

//    //Update teams.
//}
