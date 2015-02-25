using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Biggy.Core;
using Biggy.Data.Postgres;
using HuntTracker.Api.Interfaces.DataAccess;
using HuntTracker.Api.Interfaces.DataEntities;

namespace HuntTracker.Dal.Biggy.Repositories
{
    public class MarkerRepository : IMarkerRepository
    {
        private readonly BiggyList<Marker> _markers;

        public MarkerRepository()
        {
            _markers = new BiggyList<Marker>(new PgDocumentStore<Marker>("hunttrackerdb"));
        }

        public Task<IEnumerable<Marker>> GetByUser(string userId)
        {
            var markers = _markers.Where(x => x.UserId.Equals(userId, StringComparison.InvariantCultureIgnoreCase));
            return Task.FromResult(markers);
        }

        public Task InsertAsync(Marker marker)
        {
            _markers.Add(marker);
            return Task.FromResult(0);
        }

        public Task UpdateAsync(Marker marker)
        {
            var original = _markers.First(x => x.Id.Equals(marker.Id, StringComparison.InvariantCultureIgnoreCase));
            Mapper.DynamicMap(marker, original);
            return Task.FromResult(0);
        }

        public Task DeleteAsync(string markerId)
        {
            var original = _markers.First(x => x.Id.Equals(markerId, StringComparison.InvariantCultureIgnoreCase));
            _markers.Remove(original);
            return Task.FromResult(0);
        }
    }
}
