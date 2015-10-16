using HuntTracker.Api.Interfaces.DataEntities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HuntTracker.Api.Interfaces.DataAccess
{
    public interface ITeamRepository
    {
        Task<Team> GetByIdAsync(string id);
        Task<IEnumerable<Team>> GetByUserAsync(string userId, bool activeOnly);
        Task InsertAsync(Team team);
        Task UpdateAsync(Team team);
        Task DeleteAsync(string teamId);

        Task<IEnumerable<Member>> GetMemebersByTeam(string teamId);
        Task AddUserAsMember(string teamId, string userId, TeamMemberStatus status);
        Task InviteUserToTeam(string teamId, string userId);
        Task RequestMembership(string teamId, string userId);
        Task DeactivateMember(string teamId, string userId);
        Task ActivateMember(string teamId, string userId);
        Task RemoveMember(string teamId, string userId);
    }
}
