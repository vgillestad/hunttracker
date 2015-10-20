using HuntTracker.Api.Interfaces.DataAccess;
using System.Collections.Generic;
using System.Threading.Tasks;
using HuntTracker.Api.Interfaces.DataEntities;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using System.Linq;
using Microsoft.Azure.Documents;
using System;

namespace HuntTracker.Dal.DataDocumentDB.Repositories
{
    public class MarkerRepository : IMarkerRepository
    {
        private DocumentClient _client;
        private DocumentCollection _collection;
        private ITeamRepository _teamRepository;

        public MarkerRepository(DocumentClient client, DocumentCollection collection, ITeamRepository teamRepostiory)
        {
            _client = client;
            _collection = collection;
            _teamRepository = teamRepostiory;
        }

        //TODO : Must be re-written!
        public async Task<IEnumerable<Marker>> GetByUser(string userId)
        {
            var teams = await _teamRepository.GetByUserAsync(userId, true);
            var teamIds = string.Join(",", teams.Select(x => "'" + x.Id + "'"));

            var myQuery = string.Format("SELECT VALUE marker FROM marker WHERE marker.UserId = '{0}'", userId);
            var otherQuery = string.Format("SELECT VALUE marker FROM marker JOIN teamId IN marker.SharedWithTeamIds WHERE teamId IN ({0})", teamIds);

            var myMarkers = _client.CreateDocumentQuery<Marker>(
                _collection.SelfLink,
                new SqlQuerySpec()
                {
                    QueryText = myQuery,
                }).AsEnumerable();

            if (teams.Any())
            {
                var otherMarkers = _client.CreateDocumentQuery<Marker>(
                _collection.SelfLink,
                new SqlQuerySpec()
                {
                    QueryText = otherQuery,
                }).AsEnumerable();

                var allMarkers = myMarkers.ToList();
                foreach(var marker in otherMarkers.ToList())
                {
                    if(!myMarkers.Any(x => x.Id.Equals(marker.Id, StringComparison.InvariantCultureIgnoreCase)))
                    {
                        allMarkers.Add(marker);
                    }
                }

                myMarkers = allMarkers;
            }

            return myMarkers;
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
