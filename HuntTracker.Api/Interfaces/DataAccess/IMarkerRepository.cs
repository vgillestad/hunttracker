using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HuntTracker.Api.Interfaces.DataEntities;

namespace HuntTracker.Api.Interfaces.DataAccess
{
    public interface IMarkerRepository
    {
        Task<IEnumerable<Marker>> GetByUser(string userId);
        Task InsertAsync(Marker marker);
        Task UpdateAsync(Marker marker);
        Task DeleteAsync(string markerId);
    }
}
