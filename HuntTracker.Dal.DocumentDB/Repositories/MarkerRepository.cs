using HuntTracker.Api.Interfaces.DataAccess;
using System.Collections.Generic;
using System.Threading.Tasks;
using HuntTracker.Api.Interfaces.DataEntities;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using System.Linq;
using Microsoft.Azure.Documents;

namespace HuntTracker.Dal.DataDocumentDB.Repositories
{
    public class MarkerRepository : IMarkerRepository
    {
        private DocumentClient _client;
        private DocumentCollection _collection;

        public MarkerRepository(DocumentClient client, DocumentCollection collection)
        {
            _client = client;
            _collection = collection;
        }

        public Task<IEnumerable<Marker>> GetByUser(string userId)
        {
            var query = _client.CreateDocumentQuery<Marker>(_collection.SelfLink)
                .Where(x => x.UserId == userId)
                .AsEnumerable();
            return Task.FromResult(query);
        }

        public async Task InsertAsync(Marker marker)
        {
            await _client.CreateDocumentAsync(_collection.SelfLink, marker);
        }

        public async Task UpdateAsync(Marker marker)
        {
            var currentDocument = _client.CreateDocumentQuery(_collection.SelfLink)
                .Where(x => x.Id == marker.Id)
                .AsEnumerable()
                .FirstOrDefault();

            await _client.ReplaceDocumentAsync(currentDocument.SelfLink, marker);
        }

        public async Task DeleteAsync(string markerId)
        {
            var currentDocument = _client.CreateDocumentQuery(_collection.SelfLink)
                .Where(x => x.Id == markerId)
                .AsEnumerable()
                .FirstOrDefault();

            await _client.DeleteDocumentAsync(currentDocument.SelfLink);
        }
    }
}
