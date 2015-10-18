using HuntTracker.Api.Interfaces.DataAccess;
using System;
using System.Threading.Tasks;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents;
using User = HuntTracker.Api.Interfaces.DataEntities.User;
using HuntTracker.Api.Interfaces.DataEntities;
using Microsoft.Azure.Documents.Linq;
using System.Linq;
using HuntTracker.Dal.DocumentDB.Crypto;
using System.Collections.Generic;

namespace HuntTracker.Dal.DataDocumentDB.Repositories
{
    public class UserRepository : IUserRepository
    {
        private DocumentClient _client;
        private DocumentCollection _collection;

        public UserRepository(DocumentClient client, DocumentCollection collection)
        {
            _client = client;
            _collection = collection;
        }

        public Task<User> GetByEmail(string email)
        {
            var user = _client.CreateDocumentQuery<User>(_collection.SelfLink)
                .Where(x => x.Email == email)
                .AsEnumerable()
                .FirstOrDefault();
            return Task.FromResult(user);
        }

        public Task<User> GetById(string id)
        {
            var user = _client.CreateDocumentQuery<User>(_collection.SelfLink)
                .Where(x => x.Id == id)
                .AsEnumerable()
                .FirstOrDefault();
            return Task.FromResult(user);
        }

        //TODO : Needs to be re-written!
        public Task<IEnumerable<User>> GetByIds(IEnumerable<string> ids)
        {
            //var user = _client.CreateDocumentQuery<User>(_collection.SelfLink)
            //    .Where(x => ids.Any(y => x.Id.Equals(y, StringComparison.InvariantCultureIgnoreCase)))
            //    .AsEnumerable();

            var user = _client.CreateDocumentQuery<User>(_collection.SelfLink)
                .AsEnumerable()
                .Where(x => ids.Any(y => x.Id != null && x.Id.Equals(y, StringComparison.InvariantCultureIgnoreCase)));
            return Task.FromResult(user);
        }

        public Task<User> Register(User user, string password)
        {
            var userWithCredentials = new UserWithCredentials()
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Hash = PasswordHash.CreateHash(password)
            };

            _client.CreateDocumentAsync(_collection.SelfLink, userWithCredentials);

            return Task.FromResult(user);
        }

        public Task<bool> TryGetByCredentials(string username, string password, out User user)
        {
            var userWithCredentials = _client.CreateDocumentQuery<UserWithCredentials>(_collection.SelfLink)
                            .Where(x => x.Email.Equals(username))
                            .AsEnumerable()
                            .FirstOrDefault();

            if (userWithCredentials != null && PasswordHash.ValidatePassword(password, userWithCredentials.Hash))
            {
                user = new User()
                {
                    Id = userWithCredentials.Id,
                    Email = userWithCredentials.Email,
                    FirstName = userWithCredentials.FirstName,
                    LastName = userWithCredentials.LastName
                };

                return Task.FromResult(true);
            }

            user = null;
            return Task.FromResult(false);
        }
    }

    public class UserWithCredentials : User
    {
        public string Hash { get; set; }
    }
}
