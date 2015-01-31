using System.Net.Http.Formatting;
using System.Web.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using Owin;

namespace HuntTracker.Api
{
    public static class ApiAppBuildeExtension
    {
        public static IAppBuilder UseHuntTrackerApi(this IAppBuilder appBuilder)
        {
            var webApiConfig = new HttpConfiguration();
            webApiConfig.MapHttpAttributeRoutes();
            webApiConfig.Formatters.Clear();
            var jsonFormatter = new JsonMediaTypeFormatter
            {
                SerializerSettings =
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                    NullValueHandling = NullValueHandling.Ignore,
                    DateFormatHandling = DateFormatHandling.IsoDateFormat,
                    DateTimeZoneHandling = DateTimeZoneHandling.Utc,
                }
            };
            jsonFormatter.SerializerSettings.Converters.Add(new StringEnumConverter { CamelCaseText = true });
            webApiConfig.Formatters.Add(jsonFormatter);

            appBuilder.UseWebApi(webApiConfig);

            return appBuilder;
        }
    }
}
