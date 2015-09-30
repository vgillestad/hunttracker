using System.Threading.Tasks;
using HuntTracker.Api.Interfaces.DataEntities;
using System.Collections.Generic;

namespace HuntTracker.Api.Interfaces.DataAccess
{
    public interface IUserRepository
    {
        Task<User> GetById(string id);
        Task<IEnumerable<User>> GetByIds(IEnumerable<string> ids);
        Task<User> GetByEmail(string email);
        Task<bool> TryGetByCredentials(string email, string password, out User user);
        Task<User> Register(User user, string password);
    }
}
