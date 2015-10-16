using System.Security.Claims;
using System.Threading;

namespace HuntTracker.Api.Context
{
    public static class Me
    {
        public static string Id()
        {
            var currentPrincipal = (ClaimsPrincipal)Thread.CurrentPrincipal;
            return currentPrincipal.FindFirst(ClaimTypes.NameIdentifier).Value;
        }
    }
}
