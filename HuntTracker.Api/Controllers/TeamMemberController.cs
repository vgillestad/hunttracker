using System.Threading.Tasks;
using System.Web.Http;
using HuntTracker.Api.Interfaces.DataAccess;
using HuntTracker.Api.Interfaces.DataEntities;
using System.Collections.Generic;
using AutoMapper;
using System.Net;
using System.Linq;
using System.Net.Http;

namespace HuntTracker.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/teams/{teamId}")]
    public class TeamMemberController : ApiController
    {
        private readonly ITeamRepository _teamRepository;
        private readonly IUserRepository _userRepository;

        public TeamMemberController(ITeamRepository markerRepository, IUserRepository userRepository)
        {
            _teamRepository = markerRepository;
            _userRepository = userRepository;
        }

        [HttpGet]
        [Route("members")]
        public async Task<IEnumerable<Member>> GetMembers(
            [FromUri] string teamId)
        {
            return await _teamRepository.GetMemebersByTeam(teamId);      
        }

        [HttpDelete]
        [Route("members/{userId}")]
        public async Task RemoveMember(
            [FromUri] string teamId,
            [FromUri] string userId)
        {
            await _teamRepository.RemoveMember(teamId, userId);
        }

        [HttpPost]
        [Route("invite")]
        public async Task<Member> InviteUser(
            [FromUri] string teamId,
            [FromUri] string userEmail)
        {
            var user = await _userRepository.GetByEmail(userEmail);
            if(user == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            var members = await _teamRepository.GetMemebersByTeam(teamId);
            if (members.ToList().Any(x => x.UserId.Equals(user.Id))) {
                throw new HttpResponseException(new HttpResponseMessage() { StatusCode = HttpStatusCode.BadRequest, ReasonPhrase = "UserAlreadyMemberInTeam"});
            }

            await _teamRepository.InviteUserToTeam(teamId, user.Id);
            var member = new Member()
            {
                UserId = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Status = TeamMemberStatus.Invited
            };

            return member;
        }

        [HttpPost]
        [Route("members/{userId}/requestmembership")]
        public async Task RequestMembership(
            [FromUri] string teamId,
            [FromUri] string userId)
        {
            await _teamRepository.RequestMembership(teamId, userId);
        }

        [HttpPost]
        [Route("members/{userId}/activate")]
        public async Task ActivateMember(
            [FromUri] string teamId,
            [FromUri] string userId)
        {
            await _teamRepository.ActivateMember(teamId, userId);
        }

        [HttpPost]
        [Route("members/{userId}/deactivate")]
        public async Task DeactiveMember(
            [FromUri] string teamId,
            [FromUri] string userId)
        {
            await _teamRepository.DeactivateMember(teamId, userId);
        }
    }
}
