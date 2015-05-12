using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using HuntTracker.Api.Interfaces.DataAccess;
using HuntTracker.Api.Interfaces.DataEntities;
using Microsoft.Owin.Security;

namespace HuntTracker.Api.Controllers
{
    [RoutePrefix("api/auth")]
    public class AuthController : ApiController
    {
        private readonly IUserRepository _usersRepository;

        public AuthController(IUserRepository usersRepository)
        {
            _usersRepository = usersRepository;
        }

        [HttpPost]
        [Route("")]
        public async Task<HttpResponseMessage> LogIn([FromBody] Login login)
        {
            User user;
            if (login == null || !await _usersRepository.TryGetByCredentials(login.Email, login.Password, out user))
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, string.Format("{0} {1}", user.FirstName, user.LastName)),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };
            var identity = new ClaimsIdentity(claims, "HT");

            Request.GetOwinContext().Authentication.SignIn(new AuthenticationProperties { IsPersistent = true }, identity);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [HttpDelete]
        [Route("")]
        public async Task<HttpResponseMessage> LogOut()
        {
            var owinContext = Request.GetOwinContext();
            owinContext.Authentication.SignOut("HT");
            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}
