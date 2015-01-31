using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using HuntTracker.Api.Interfaces.DataEntities;

namespace HuntTracker.Api.Controllers
{
    [RoutePrefix("api/markers")]
    public class MarkerController : ApiController
    {
        public static List<Marker> Markers = new List<Marker>();

        //[HttpGet]
        //[Route("")]
        //public List<Marker> GetAll()
        //{
        //    return Markers.ToList();
        //}

        [HttpGet]
        [Route("")]
        public List<Marker> GetByOwner([FromUri] Guid userId)
        {
            return Markers.Where(x=>x.UserId == userId).ToList();
        }

        [HttpGet]
        [Route("{id}")]
        public Marker GetById([FromUri] Guid id)
        {
            return Markers.First(x => x.Id == id);
        }

        [HttpPost]
        [Route("")]
        public Marker Post([FromBody] Marker marker)
        {
            Markers.Add(marker);
            return marker;
        }

        [HttpPut]
        public Marker Put([FromBody] Marker marker)
        {
            var current = Markers.First(x => x.Id == marker.Id);
            Mapper.DynamicMap(marker, current);

            return current;
        }

        [HttpDelete]
        public HttpResponseMessage Delete([FromUri] Guid id)
        {
            var current = Markers.First(x => x.Id == id);
            Markers.Remove(current);
            return new HttpResponseMessage(HttpStatusCode.Accepted);
        }
    }
}
