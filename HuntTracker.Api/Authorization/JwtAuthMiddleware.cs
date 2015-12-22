using Microsoft.Owin;
using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace HuntTracker.Api.Authorization
{
    public class JwtAuthMiddleware : OwinMiddleware
    {
        private OwinMiddleware _next;
        private ITokenHandler _tokenHandler;
        private static readonly Regex AuthToken = new Regex(@"bearer\s+(?<token>.+)", RegexOptions.IgnorePatternWhitespace | RegexOptions.Compiled | RegexOptions.CultureInvariant | RegexOptions.IgnoreCase);

        public JwtAuthMiddleware(OwinMiddleware next, ITokenHandler tokenHandler) : base(next)
        {
            _tokenHandler = tokenHandler;
            _next = next;
        }

        public async override Task Invoke(IOwinContext context)
        {
            var request = context.Request;
            var authStr = request.Headers.Get("Authorization");
            if (authStr != null)
            {
                var match = AuthToken.Match(authStr);
                if (match.Success)
                {
                    IEnumerable<Claim> claims;
                    if (_tokenHandler.TryValidateToken(match.Groups["token"].Value, out claims))
                    {
                        var identity = new ClaimsIdentity(claims, "HT");

                        context.Authentication.User = new ClaimsPrincipal(identity);
                        Thread.CurrentPrincipal = context.Authentication.User;
                    };
                }
            }

            await Next.Invoke(context);
        }
    }

    public class AuthOptions
    {
        public string authenticationName { get; set; }
        public string secret { get; set; }
    }
}
