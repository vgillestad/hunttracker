angular.module('HTServices')

    .factory('MemberSource', ["$resource", function ($resource) {
        var sources = $resource("/api/teams/:teamId/members/:userId", null, {
            getByTeamId: { method: "GET", url: "/api/teams/:teamId/members", isArray: true, params: { teamId: "@teamId" } },
            invite: { method: "POST", url: "/api/teams/:teamId/invite", params: { teamId: "@teamId", userEmail: "@userEmail" } },
            requestMembership: { method: "POST", params: { teamId: "@teamId", userId: "@userId" } },
            activate: { method: "POST", url: "/api/teams/:teamId/members/:userId/activate", params: { teamId: "@teamId", userId: "@userId" } },
            pause: { method: "POST", url: "/api/teams/:teamId/members/:userId/pause", params: { teamId: "@teamId", userId: "@userId" } },
            remove: { method: "DELETE", params: { teamId: "@teamId", userId: "@userId" } }
        });

        return sources;
    }]);