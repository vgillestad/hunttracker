using HuntTracker.Api.Interfaces.DataAccess;
using System.Threading.Tasks;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents;
using User = HuntTracker.Api.Interfaces.DataEntities.User;
using Microsoft.Azure.Documents.Linq;
using System.Linq;
using HuntTracker.Dal.DocumentDB.Crypto;
using System.Collections.Generic;
using HuntTracker.Api.Interfaces.DataEntities;
using System;
using AutoMapper;

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

        //TODO : Needs to be re-written! Could not figure out how to pass a list of strings in sql-parameter
        public Task<IEnumerable<User>> GetByIds(IEnumerable<string> ids)
        {
            var where = "(" + string.Join(",", ids.Select(x => "'" + x + "'")) + ")";
            var users = _client.CreateDocumentQuery<User>(
                _collection.SelfLink,
                new SqlQuerySpec()
                {
                    QueryText = @"
                        SELECT VALUE user 
                        FROM user 
                        WHERE user.id IN " + where,
                }).AsEnumerable();

            return Task.FromResult(users);
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

        public async Task Update(User user)
        {
            var currentDocument = _client.CreateDocumentQuery(_collection.SelfLink)
                .Where(x => x.Id == user.Id)
                .AsEnumerable()
                .FirstOrDefault();

            var userWithCredentials = (UserWithCredentials)(dynamic)currentDocument;
            Mapper.DynamicMap(user, userWithCredentials);

            await _client.ReplaceDocumentAsync(currentDocument.SelfLink, userWithCredentials);
        }
    }

    public class UserWithCredentials : User
    {
        public string Hash { get; set; }
    }
}
