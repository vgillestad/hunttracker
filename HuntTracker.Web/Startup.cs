using System;
using Autofac;
using Autofac.Integration.WebApi;
using HuntTracker.Api;
using HuntTracker.Api.Controllers;
using HuntTracker.Dal.Biggy.Repositories;
using HuntTracker.Web;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;

[assembly: OwinStartup(typeof(Startup))]
namespace HuntTracker.Web
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //Autofac
            var builder = new ContainerBuilder();
            builder.RegisterType<MarkerRepository>().AsImplementedInterfaces().SingleInstance();
            builder.RegisterType<UserRepository>().AsImplementedInterfaces().SingleInstance();

            builder.RegisterApiControllers(typeof(MarkerController).Assembly);
            var container = builder.Build();
            
            app.UseAutofacMiddleware(container);

            app.UseCookieAuthentication(new CookieAuthenticationOptions()
            {
                AuthenticationType = "HT",
                CookieSecure = CookieSecureOption.SameAsRequest,
                ExpireTimeSpan = TimeSpan.FromDays(7),
                SlidingExpiration = true,
            });

            app.UseHuntTrackerApi();
        }
    }
}