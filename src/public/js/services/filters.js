angular.module('HTServices')

    .factory('FilterSource', function () {

        var filters = {};
        
        filters["all"] = {
            name: "All",
            mineOnly: { enabled: false },
            team: { enabled: false },
            tag: { enabled: false },
            fromDate: { enabled: false },
            toDate: { enabled: false }
        };
        
        filters["none"] = {
            name: "None",
            mineOnly: { enabled: false },
            team: { enabled: false },
            tag: { enabled: false },
            fromDate: { enabled:false }, 
            toDate: { enabled: true, date: new Date(0) } //Will exclude all
        }
        
        filters["31-days"] = {
            name: "Latest 31 days",
            mineOnly: { enabled: false },
            team: { enabled: false },
            tag: { enabled: false },
            fromDate: { enabled: true, date: (function () {
               var oneDayInMS = 86400000;
               var now = new Date();
               return new Date(now.getTime() - (31 * oneDayInMS)); 
            }()) }, 
            toDate: { enabled: false }
        }
        
        return {
            getAll: function () {
                return filters;
            }
        };
    });