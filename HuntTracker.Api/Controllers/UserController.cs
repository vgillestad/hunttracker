using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using AutoMapper;
using HuntTracker.Api.Interfaces.DataAccess;
using HuntTracker.Api.Interfaces.DataEntities;
using HuntTracker.Api.Models;

namespace HuntTracker.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/users")]
    public class UserController : ApiController
    {
        private readonly IUserRepository _userRepository;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        [Route("current")]
        public async Task<User> Current()
        {
            var currentPrincipal = (ClaimsPrincipal)Thread.CurrentPrincipal;
            var userId = currentPrincipal.FindFirst(ClaimTypes.NameIdentifier).Value;
            return await _userRepository.GetById(userId);
        }

        [HttpPost]
        [Route("")]
        public async Task<User> Register(RegisterUserModel registerUser)
        {
            var newUser = Mapper.DynamicMap<RegisterUserModel, User>(registerUser);
            newUser.Id = Guid.NewGuid().ToString();
            var created = await _userRepository.Register(newUser, registerUser.Password);
            return created;
        }
    }
}
