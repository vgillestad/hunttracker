using HuntTracker.Api.Interfaces.DataAccess;
using System;
using System.Threading.Tasks;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents;
using User = HuntTracker.Api.Interfaces.DataEntities.User;

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

        public Task<User> GetById(string id)
        {
            throw new NotImplementedException();
        }

        public Task Register(User user, string password)
        {
            throw new NotImplementedException();
        }

        public Task<bool> TryGetByCredentials(string username, string password, out User user)
        {
            throw new NotImplementedException();
        }
    }
}
