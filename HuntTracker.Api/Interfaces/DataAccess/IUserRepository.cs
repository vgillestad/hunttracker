using System.Threading.Tasks;
using HuntTracker.Api.Interfaces.DataEntities;

namespace HuntTracker.Api.Interfaces.DataAccess
{
    public interface IUserRepository
    {
        Task<User> GetById(string id);
        Task<bool> TryGetByCredentials(string username, string password, out User user);
        Task Register(User user, string password);
    }
}
