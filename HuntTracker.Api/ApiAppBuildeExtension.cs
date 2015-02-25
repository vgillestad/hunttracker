﻿using System.Net.Http.Formatting;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Dispatcher;
using Autofac;
using Autofac.Integration.WebApi;
using HuntTracker.Api.Interfaces.DataAccess;
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

            appBuilder.UseAutofacWebApi(webApiConfig);
            appBuilder.UseWebApi(webApiConfig);

            return appBuilder;
        }
    }
}