using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Biggy.Core;
using HuntTracker.Api.Interfaces.DataAccess;
using HuntTracker.Api.Interfaces.DataEntities;
using HuntTracker.Dal.Biggy.Crypto;
using Biggy.Data.Json;

namespace HuntTracker.Dal.File.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly BiggyList<UserWithCredentials> _users; 

        public UserRepository(string path)
        {
            var db = new JsonDbCore(path, "HT");
            _users = new BiggyList<UserWithCredentials>(new JsonStore<UserWithCredentials>(db));
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
            var userWithCredentials = _users.FirstOrDefault(x => x.Email.Equals(email, StringComparison.InvariantCultureIgnoreCase));
            return Task.FromResult((User) userWithCredentials);
        }
    }

    public class UserWithCredentials : User
    {
        public string Hash { get; set; }
    }
}
