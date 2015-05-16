using System.Threading.Tasks;
using HuntTracker.Api.Interfaces.DataEntities;

namespace HuntTracker.Api.Interfaces.DataAccess
{
    public interface IUserRepository
    {
        Task<User> GetById(string id);
        Task<User> GetByEmail(string email);
        Task<bool> TryGetByCredentials(string email, string password, out User user);
        Task<User> Register(User user, string password);
    }
}
