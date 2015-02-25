using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using HuntTracker.Api.Interfaces.DataAccess;
using HuntTracker.Api.Interfaces.DataEntities;

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
            var currentPrincipal = (ClaimsPrincipal) Thread.CurrentPrincipal;
            var userId = currentPrincipal.FindFirst(ClaimTypes.NameIdentifier).Value;
            return await _userRepository.GetById(userId);
        }
    }
}
