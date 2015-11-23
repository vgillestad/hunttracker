using System;
using System.Threading.Tasks;
using System.Web.Http;
using AutoMapper;
using HuntTracker.Api.Interfaces.DataAccess;
using HuntTracker.Api.Interfaces.DataEntities;
using HuntTracker.Api.Models;
using System.Net;
using System.Net.Mail;
using HuntTracker.Api.Context;

namespace HuntTracker.Api.Controllers
{
    [RoutePrefix("api")]
    public class UserController : ApiController
    {
        private readonly IUserRepository _userRepository;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [Authorize]
        [HttpGet]
        [Route("me")]
        public async Task<User> Current()
        {
            return await _userRepository.GetById(Me.Id());
        }

        [Authorize]
        [HttpPut]
        [Route("me")]
        public async Task Update([FromBody] User user)
        {
            await _userRepository.Update(user);
        }

        [Authorize]
        [HttpGet]
        [Route("users/{id}")]
        public async Task<User> Get([FromUri] string id)
        {
            if (id == "current") //Backward compability
                return await Current();

            return await _userRepository.GetById(id);
        }

        [HttpPost]
        [Route("users")]
        public async Task<User> Register(RegisterUserModel registerUser)
        {
            var newUser = Mapper.DynamicMap<RegisterUserModel, User>(registerUser);
            if (string.IsNullOrEmpty(registerUser.Email) ||
                string.IsNullOrEmpty(registerUser.FirstName) ||
                string.IsNullOrEmpty(registerUser.LastName) ||
                string.IsNullOrEmpty(registerUser.Password))
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }

            var user = await _userRepository.GetByEmail(registerUser.Email);
            if (user != null)
            {
                throw new HttpResponseException(HttpStatusCode.Conflict);
            }
            try
            {
                new MailAddress(registerUser.Email);
            }
            catch (Exception)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }

            newUser.Id = Guid.NewGuid().ToString();
            var created = await _userRepository.Register(newUser, registerUser.Password);
            return created;
        }
    }
}
