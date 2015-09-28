using HuntTracker.Api.Interfaces.DataEntities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HuntTracker.Api.Interfaces.DataAccess
{
    public interface ITeamRepository
    {
        Task<Team> GetByIdAsync(string id);
        Task<IEnumerable<Team>> GetByUserAsync(string userId);
        Task InsertAsync(Team marker);
        Task UpdateAsync(Team marker);
        Task DeleteAsync(string teamId);
    }
}
