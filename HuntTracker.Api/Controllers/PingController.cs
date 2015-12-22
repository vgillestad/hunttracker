using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace HuntTracker.Api.Controllers
{

    public class PingController : ApiController
    {
        [Route("api/ping")]
        public string Get(string name = "")
        {
            var current = Thread.CurrentPrincipal;

            return "Hello " + name;
        }

        [Route("api/ping")]
        public string Post()
        {
            return "Posted ";
        }
    }
}
