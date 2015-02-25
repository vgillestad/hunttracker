using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Biggy.Core;
using Biggy.Data.Postgres;
using HuntTracker.Api.Interfaces.DataAccess;
using HuntTracker.Api.Interfaces.DataEntities;

namespace HuntTracker.Dal.Biggy.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly BiggyList<UserWithCredentials> _users; 

        public UserRepository()
        {
            _users = new BiggyList<UserWithCredentials>(new PgDocumentStore<UserWithCredentials>("hunttrackerdb"));
        }

        public Task<User> GetById(string id)
        {
            var userWithCredentials = _users.FirstOrDefault(x => x.Id.Equals(id, StringComparison.InvariantCultureIgnoreCase));
            var user = (User) userWithCredentials;
            return Task.FromResult(user);
        }

        public Task<bool> TryGetByCredentials(string email, string password, out User user)
        {
            var all = _users;
            var userWithCredentials = _users.FirstOrDefault(x => x.Email.Equals(email, StringComparison.InvariantCultureIgnoreCase) && x.Password.Equals(password));
            if (userWithCredentials != null)
            {
                user = userWithCredentials;
                return Task.FromResult(true);
            }

            user = null;
            return Task.FromResult(false);
        }

        public Task Register(User user, string password)
        {
            var userWithCredentials = Mapper.DynamicMap<User, UserWithCredentials>(user);
            _users.Add(userWithCredentials);
            return Task.FromResult(0);
        }
    }

    public class UserWithCredentials : User
    {
        public string Password { get; set; }
    }
}
