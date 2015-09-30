using System.Threading.Tasks;
using System.Web.Http;
using HuntTracker.Api.Interfaces.DataAccess;
using HuntTracker.Api.Interfaces.DataEntities;
using System.Collections.Generic;
using System.Linq;

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
        public async Task<IEnumerable<MemberFull>> GetMembers(
            [FromUri] string teamId)
        {
            var team = await _teamRepository.GetByIdAsync(teamId);
            var users = await _userRepository.GetByIds(team.Members.Select(x => x.Id));
            return users.Select(x =>{
                var member = (MemberFull) x;
                member.Status = team.Members.First(y => y.Id.Equals(x.Id)).Status;
                return member;
            });       
        }


        [HttpDelete]
        [Route("members/{memberId}")]
        public async Task RemoveMember(
            [FromUri] string teamId,
            [FromUri] string memberId)
        {
            var team = await _teamRepository.GetByIdAsync(teamId);
            team.Members.ToList().Remove(team.Members.First(x => x.Id.Equals(memberId)));
            await _teamRepository.UpdateAsync(team);
        }

        [HttpPost]
        [Route("invite")]
        public async Task InviteUser(
            [FromUri] string teamId,
            [FromBody] string email)
        {
            var user = await _userRepository.GetByEmail(email);
            var team = await _teamRepository.GetByIdAsync(teamId);
            team.Members.ToList().Add(new Member() { Id = user.Id, Status = TeamMemberStatus.Invited });
            await _teamRepository.UpdateAsync(team);
        }

        [HttpPost]
        [Route("members/{userId}/requestmembership")]
        public async Task RequestMembership(
            [FromUri] string teamId,
            [FromUri] string userId)
        {
            var team = await _teamRepository.GetByIdAsync(teamId);
            team.Members.ToList().Add(new Member() { Id = userId, Status = TeamMemberStatus.RequestingMembership });
            await _teamRepository.UpdateAsync(team);
        }

        [HttpPut]
        [Route("members/{memberId}/activate")]
        public async Task ActivateMember(
            [FromUri] string teamId,
            [FromUri] string memberId)
        {
            var team = await _teamRepository.GetByIdAsync(teamId);
            team.Members.First(x=>x.Id.Equals(memberId)).Status = TeamMemberStatus.Active;
            await _teamRepository.UpdateAsync(team);
        }

        [HttpPut]
        [Route("members/{memberId}/deactivate")]
        public async Task DeactiveMember(
            [FromUri] string teamId,
            [FromUri] string memberId)
        {
            var team = await _teamRepository.GetByIdAsync(teamId);
            team.Members.First(x => x.Id.Equals(memberId)).Status = TeamMemberStatus.Deactivated;
            await _teamRepository.UpdateAsync(team);
        }
    }
}
