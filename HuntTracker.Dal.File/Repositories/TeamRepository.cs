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
        private BiggyList<TeamStored> _teams;
        private IUserRepository _userRepository;

        public TeamRepository(string path, IUserRepository userRepository)
        {
            var db = new JsonDbCore(path, "HT");
            _teams = new BiggyList<TeamStored>(new JsonStore<TeamStored>(db));
            _userRepository = userRepository;
        }

        public Task DeleteAsync(string markerId)
        {
            var original = _teams.First(x => x.Id.Equals(markerId, StringComparison.InvariantCultureIgnoreCase));
            _teams.Remove(original);
            return Task.FromResult(0);
        }

        public Task<Team> GetByIdAsync(string id)
        {
            var team = (Team)_teams.First(x => x.Id == id);
            return Task.FromResult(team);
        }

        public Task<IEnumerable<Team>> GetByUserAsync(string userId)
        {
            var teams = (IEnumerable<Team>) _teams.Where(x =>x.AdminId.Equals(userId) || x.Members.Any(y => y.UserId.Equals(userId)));
            return Task.FromResult(teams);
        }

        public Task InsertAsync(Team team)
        {
            var toAdd = Mapper.DynamicMap<Team,TeamStored>(team);
            _teams.Add(toAdd);
            return Task.FromResult(0);
        }

        public Task UpdateAsync(Team team)
        {
            var original = _teams.First(x => x.Id.Equals(team.Id, StringComparison.InvariantCultureIgnoreCase));
            Mapper.DynamicMap(team, original);
            return Task.FromResult(0);
        }

        public async Task<IEnumerable<Member>> GetMemebersByTeam(string teamId)
        {
            var members = _teams.First(x => x.Id == teamId).Members;
            var users =  await _userRepository.GetByIds(members.Select(x => x.UserId));
            return users.Select(x =>
            {
                var member = new Member()
                {
                    UserId = x.Id,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    Status = members.First(y => y.UserId == x.Id).Status
                };
                return member;
            });
        }

        public Task InviteUserToTeam(string teamId, string userId)
        {
            var team = _teams.First(x => x.Id == teamId);
            var members = team.Members.ToList();
            members.Add(new MemberStored() { UserId = userId, Status = TeamMemberStatus.Invited });
            team.Members = members;
            _teams.Update(team);
            return Task.FromResult(0);
        }

        public Task RequestMembership(string teamId, string userId)
        {
            var team = _teams.First(x => x.Id == teamId);
            var members = team.Members.ToList();
            members.Add(new MemberStored() { UserId = userId, Status = TeamMemberStatus.RequestingMembership });
            team.Members = members;
            return Task.FromResult(0);
        }

        public Task DeactivateMember(string teamId, string userId)
        {
            _teams.First(x => x.Id == teamId).Members.First(x => x.UserId.Equals(userId)).Status = TeamMemberStatus.Deactivated;
            return Task.FromResult(0);
        }

        public Task ActivateMember(string teamId, string userId)
        {
            _teams.First(x => x.Id == teamId).Members.First(x => x.UserId.Equals(userId)).Status = TeamMemberStatus.Active;
            return Task.FromResult(0);
        }

        public Task RemoveMember(string teamId, string userId)
        {
            var team = _teams.First(x => x.Id == teamId);
            var members = team.Members.ToList();
            members.Remove(team.Members.First(x => x.UserId.Equals(userId)));
            team.Members = members;
            _teams.Update(team);
            return Task.FromResult(0);
        }

        public Task AddUserAsMember(string teamId, string userId, TeamMemberStatus status)
        {
            var team = _teams.First(x => x.Id == teamId);
            var members = team.Members.ToList();
            members.Add(new MemberStored() { UserId = userId, Status = status });
            team.Members = members;
            _teams.Update(team);
            return Task.FromResult(0);
        }

        private class TeamStored : Team
        {
            public IEnumerable<MemberStored> Members { get; set; }

            public TeamStored()
            {
                Members = new List<MemberStored>();
            }
        }

        private class MemberStored
        {
            public string UserId { get; set; }
            public TeamMemberStatus Status { get; set; }
        }
    }
}
