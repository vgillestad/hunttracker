using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Biggy.Core;
using Biggy.Data.Postgres;
using HuntTracker.Api.Interfaces.DataAccess;
using HuntTracker.Api.Interfaces.DataEntities;
using HuntTracker.Dal.Biggy.Crypto;

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
            var userWithCredentials = _users.FirstOrDefault(x => x.Email.Equals(email, StringComparison.InvariantCultureIgnoreCase));
            if (userWithCredentials != null)
            {
                var correctPassword = PasswordHash.ValidatePassword(password, userWithCredentials.Hash);
                if (correctPassword)
                {
                    user = userWithCredentials;
                    return Task.FromResult(true);
                }
            }

            user = null;
            return Task.FromResult(false);
        }

        public Task<User> Register(User user, string password)
        {
            var existingUser = _users.FirstOrDefault(x => x.Email.Equals(user.Email, StringComparison.InvariantCultureIgnoreCase));
            if (existingUser != null)
            {
                throw new Exception("Email not unique");
            }

            var userWithCredentials = Mapper.DynamicMap<User, UserWithCredentials>(user);
            userWithCredentials.Hash = PasswordHash.CreateHash(password);
            _users.Add(userWithCredentials);

            return Task.FromResult((User) userWithCredentials);
        }

        public Task<User> GetByEmail(string email)
        {
            throw new NotImplementedException();
        }
    }

    public class UserWithCredentials : User
    {
        public string Hash { get; set; }
    }
}
