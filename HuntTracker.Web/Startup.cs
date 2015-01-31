using HuntTracker.Api;
using HuntTracker.Web;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Startup))]
namespace HuntTracker.Web
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseHuntTrackerApi();
        }
    }
}