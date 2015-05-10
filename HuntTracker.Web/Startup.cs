using System;
using Autofac;
using Autofac.Integration.WebApi;
using HuntTracker.Api;
using HuntTracker.Api.Controllers;
using HuntTracker.Web;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;
using System.Configuration;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Linq;
using System.Linq;
using HuntTracker.Dal.DataDocumentDB.Repositories;

[assembly: OwinStartup(typeof(Startup))]
namespace HuntTracker.Web
{
    public class Startup
    {
        private DocumentClient client;

        public void Configuration(IAppBuilder app)
        {
            string serviceEndpoint = ConfigurationManager.AppSettings["serviceEndpoint"];
            string authKey = ConfigurationManager.AppSettings["authKey"];
            client = new DocumentClient(new Uri(serviceEndpoint), authKey);
            var database = ReadOrCreateDatabase("HuntTrackerDB");
            var collection = ReadOrCreateCollection(database.SelfLink, "HuntTrackerCollection");


            //Autofac
            var builder = new ContainerBuilder();
            builder.Register(x => client).AsSelf().SingleInstance();
            builder.Register(x => collection).AsSelf().SingleInstance();
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

        private Database ReadOrCreateDatabase(string databaseId)
        {
            var db = client.CreateDatabaseQuery()
                            .Where(d => d.Id == databaseId)
                            .AsEnumerable()
                            .FirstOrDefault();
            return db ?? client.CreateDatabaseAsync(new Database { Id = databaseId }).Result;
        }

        private DocumentCollection ReadOrCreateCollection(string databaseLink, string collectionId)
        {
            var col = client.CreateDocumentCollectionQuery(databaseLink)
                              .Where(c => c.Id == collectionId)
                              .AsEnumerable()
                              .FirstOrDefault();
            return col ?? client.CreateDocumentCollectionAsync(databaseLink, new DocumentCollection { Id = collectionId }).Result;
        }
    }
}