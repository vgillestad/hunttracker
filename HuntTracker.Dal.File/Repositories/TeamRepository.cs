using HuntTracker.Api.Interfaces.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HuntTracker.Api.Interfaces.DataEntities;
using Biggy.Core;
using Biggy.Data.Json;
using AutoMapper;

namespace HuntTracker.Dal.File.Repositories
{
    public class TeamRepository : ITeamRepository
    {
        private BiggyList<Team> _teams;

        public TeamRepository(string path)
        {
            var db = new JsonDbCore(path, "HT");
            _teams = new BiggyList<Team>(new JsonStore<Team>(db));
        }

        public Task DeleteAsync(string markerId)
        {
            var original = _teams.First(x => x.Id.Equals(markerId, StringComparison.InvariantCultureIgnoreCase));
            _teams.Remove(original);
            return Task.FromResult(0);
        }

        public Task<Team> GetByIdAsync(string id)
        {
            var team =_teams.First(x => x.Id == id);
            return Task.FromResult(team);
        }

        public Task<IEnumerable<Team>> GetByUserAsync(string userId)
        {
            var teams = _teams.Where(x => x.Members.Any(y =>y.Id.Equals(userId)));
            return Task.FromResult(teams);
        }

        public Task InsertAsync(Team marker)
        {
            _teams.Add(marker);
            return Task.FromResult(0);
        }

        public Task UpdateAsync(Team team)
        {
            var original = _teams.First(x => x.Id.Equals(team.Id, StringComparison.InvariantCultureIgnoreCase));
            Mapper.DynamicMap(team, original);
            return Task.FromResult(0);
        }
    }
}
