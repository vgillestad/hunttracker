using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace HuntTracker.Api.Authorization
{
    public interface ITokenHandler
    {
        bool TryValidateToken(string token, out IEnumerable<Claim> claims);
        string CreateToken(IEnumerable<Claim> claims);
    }

    public class TokenHandler : ITokenHandler
    {
        private string _secretKey = "GQDstcKsx0NHjPOuXOYg5MbeJ1XT0uFiwDVvVBrk";

        public string CreateToken(IEnumerable<Claim> claims)
        {
            var payload = new Dictionary<string, object>();
            foreach (var item in claims)
            {
                payload.Add(item.Type, item.Value);
            };

            return JWT.JsonWebToken.Encode(payload, _secretKey, JWT.JwtHashAlgorithm.HS256);
        }

        public bool TryValidateToken(string token, out IEnumerable<Claim> claims)
        {
            try
            {
                var payload = JWT.JsonWebToken.DecodeToObject(token, _secretKey) as IDictionary<string, object>;
                claims = payload.Keys.Select(x => new Claim(x, payload[x].ToString()));
                return true;
            }
            catch (JWT.SignatureVerificationException)
            {
            }

            claims = null;
            return false;
        }
    }
}
