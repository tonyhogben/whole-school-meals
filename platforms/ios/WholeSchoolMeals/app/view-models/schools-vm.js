"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_array_1 = require("data/observable-array");
var application_settings_1 = require("application-settings");
var models_1 = require("../shared/models");
var couchbase = require("nativescript-couchbase");
var nativescript_plugin_firebase_1 = require("nativescript-plugin-firebase");
var SchoolList = (function (_super) {
    __extends(SchoolList, _super);
    function SchoolList() {
        return _super.call(this) || this;
    }
    SchoolList.prototype.load = function (updateSubscriptions) {
        var _this = this;
        if (updateSubscriptions === void 0) { updateSubscriptions = false; }
        return fetch(models_1.Config.apiUrl + "schools.ashx")
            .then(handleErrors)
            .then(function (response) {
            return response.json();
        }).then(function (data) {
            // Process the list of schools
            data.forEach(function (school) {
                _this.handleData(school, updateSubscriptions);
            });
            // Add to local db
            var database = new couchbase.Couchbase("wsm");
            var schools = database.getDocument("schools");
            if (!schools) {
                database.createDocument(data, "schools");
            }
            else {
                database.updateDocument("schools", data);
            }
        }).then(function () {
            // Always set this as this would have happened by now and if this is a first run, it's nice to be declaritive ;)
            application_settings_1.setBoolean("updateNotificationTopics", false);
        }).catch(function (error) {
            _this.checkDatabase(error);
        });
    };
    SchoolList.prototype.updateSubscriptions = function () {
        this.load(true);
    };
    SchoolList.prototype.handleData = function (school, updateSubscriptions) {
        // Has the user saved this school in their prefs?
        var inMySchools = false;
        if (this.mySchools) {
            inMySchools = this.mySchools.includes(school.SchoolID);
        }
        this.push({
            name: school.Name,
            town: school.Town,
            id: school.SchoolID,
            selected: inMySchools
        });
        if (updateSubscriptions) {
            var topicID = "school" + school.SchoolID;
            if (inMySchools) {
                // Subscribe to the 'topic' for notifications
                //console.log("subscribeToTopic: " + topicID);
                nativescript_plugin_firebase_1.subscribeToTopic(topicID);
            }
            else {
                //console.log("unsubscribeFromTopic: " + topicID);
                nativescript_plugin_firebase_1.unsubscribeFromTopic(topicID);
            }
        }
    };
    SchoolList.prototype.checkDatabase = function (error) {
        var database = new couchbase.Couchbase("wsm");
        var schools = database.getDocument("schools");
        if (!schools) {
            throw Error(error);
        }
        else {
            for (var i = 0; i < Object.keys(schools).length; i++) {
                this.handleData(schools[i]);
            }
        }
    };
    SchoolList.prototype.clear = function () {
        while (this.length) {
            this.pop();
        }
    };
    Object.defineProperty(SchoolList.prototype, "mySchools", {
        get: function () {
            var strSchools = application_settings_1.getString(models_1.Config.appSettings_mySchools);
            var arrSchools = [];
            if (strSchools) {
                strSchools.split(',').forEach(function (item) { return arrSchools.push(Number(item)); });
            }
            return arrSchools;
        },
        set: function (schools) {
            application_settings_1.setString(models_1.Config.appSettings_mySchools, schools.toString());
        },
        enumerable: true,
        configurable: true
    });
    return SchoolList;
}(observable_array_1.ObservableArray));
exports.SchoolList = SchoolList;
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.status);
    }
    return response;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nob29scy12bS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNjaG9vbHMtdm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwREFBd0Q7QUFDeEQsNkRBQXdFO0FBQ3hFLDJDQUFrRDtBQUNsRCxrREFBb0Q7QUFDcEQsNkVBQXNGO0FBRXRGO0lBQWdDLDhCQUF1QjtJQUNuRDtlQUNJLGlCQUFPO0lBQ1gsQ0FBQztJQUVELHlCQUFJLEdBQUosVUFBSyxtQkFBb0M7UUFBekMsaUJBeUJDO1FBekJJLG9DQUFBLEVBQUEsMkJBQW9DO1FBQ3JDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBTSxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7YUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQzthQUNsQixJQUFJLENBQUMsVUFBUyxRQUFRO1lBQ25CLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtZQUNSLDhCQUE4QjtZQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTTtnQkFDZixLQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQ2pELENBQUMsQ0FBQyxDQUFDO1lBRUgsa0JBQWtCO1lBQ2xCLElBQUksUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QyxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDWCxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM3QyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7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LENBQUMsQ0FBQztZQUN6RSxDQUFDO1lBRUQsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUN0QixDQUFDO2FBRUQsVUFBYyxPQUFpQjtZQUMzQixnQ0FBUyxDQUFDLGVBQU0sQ0FBQyxxQkFBcUIsRUFBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtRQUM5RCxDQUFDOzs7T0FKQTtJQUtMLGlCQUFDO0FBQUQsQ0FBQyxBQWhHRCxDQUFnQyxrQ0FBZSxHQWdHOUM7QUFoR1ksZ0NBQVU7QUFrR3ZCLHNCQUFzQixRQUFRO0lBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDZixNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDcEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGVBcnJheSB9IGZyb20gJ2RhdGEvb2JzZXJ2YWJsZS1hcnJheSc7XG5pbXBvcnQgeyBnZXRTdHJpbmcsIHNldFN0cmluZywgc2V0Qm9vbGVhbiB9IGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuaW1wb3J0IHsgQ29uZmlnLCBTY2hvb2wgfSBmcm9tICcuLi9zaGFyZWQvbW9kZWxzJztcbmltcG9ydCAqIGFzIGNvdWNoYmFzZSBmcm9tIFwibmF0aXZlc2NyaXB0LWNvdWNoYmFzZVwiO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9Ub3BpYywgdW5zdWJzY3JpYmVGcm9tVG9waWMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXBsdWdpbi1maXJlYmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgU2Nob29sTGlzdCBleHRlbmRzIE9ic2VydmFibGVBcnJheTxTY2hvb2w+IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTsgICAgICAgXG4gICAgfVxuXG4gICAgbG9hZCh1cGRhdGVTdWJzY3JpcHRpb25zOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKENvbmZpZy5hcGlVcmwgKyBcInNjaG9vbHMuYXNoeFwiKVxuICAgICAgICAgICAgLnRoZW4oaGFuZGxlRXJyb3JzKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgfSkudGhlbihkYXRhID0+IHsgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBQcm9jZXNzIHRoZSBsaXN0IG9mIHNjaG9vbHNcbiAgICAgICAgICAgICAgICBkYXRhLmZvckVhY2goc2Nob29sID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVEYXRhKHNjaG9vbCwgdXBkYXRlU3Vic2NyaXB0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgdG8gbG9jYWwgZGJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YWJhc2UgPSBuZXcgY291Y2hiYXNlLkNvdWNoYmFzZShcIndzbVwiKTtcbiAgICAgICAgICAgICAgICBsZXQgc2Nob29scyA9IGRhdGFiYXNlLmdldERvY3VtZW50KFwic2Nob29sc1wiKTtcbiAgICAgICAgICAgICAgICBpZiAoIXNjaG9vbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YWJhc2UuY3JlYXRlRG9jdW1lbnQoZGF0YSwgXCJzY2hvb2xzXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFiYXNlLnVwZGF0ZURvY3VtZW50KFwic2Nob29sc1wiLCBkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIEFsd2F5cyBzZXQgdGhpcyBhcyB0aGlzIHdvdWxkIGhhdmUgaGFwcGVuZWQgYnkgbm93IGFuZCBpZiB0aGlzIGlzIGEgZmlyc3QgcnVuLCBpdCdzIG5pY2UgdG8gYmUgZGVjbGFyaXRpdmUgOylcbiAgICAgICAgICAgICAgICBzZXRCb29sZWFuKFwidXBkYXRlTm90aWZpY2F0aW9uVG9waWNzXCIsIGZhbHNlKVxuICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tEYXRhYmFzZShlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1cGRhdGVTdWJzY3JpcHRpb25zKCkge1xuICAgICAgICB0aGlzLmxvYWQodHJ1ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVEYXRhKHNjaG9vbCwgdXBkYXRlU3Vic2NyaXB0aW9ucz86IGJvb2xlYW4pIHsgICAgICAgICAgICAgIFxuICAgICAgICAvLyBIYXMgdGhlIHVzZXIgc2F2ZWQgdGhpcyBzY2hvb2wgaW4gdGhlaXIgcHJlZnM/XG4gICAgICAgIGxldCBpbk15U2Nob29sczogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5teVNjaG9vbHMpIHtcbiAgICAgICAgICAgIGluTXlTY2hvb2xzID0gdGhpcy5teVNjaG9vbHMuaW5jbHVkZXMoc2Nob29sLlNjaG9vbElEKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBzY2hvb2wuTmFtZSxcbiAgICAgICAgICAgIHRvd246IHNjaG9vbC5Ub3duLFxuICAgICAgICAgICAgaWQ6IHNjaG9vbC5TY2hvb2xJRCxcbiAgICAgICAgICAgIHNlbGVjdGVkOiBpbk15U2Nob29sc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodXBkYXRlU3Vic2NyaXB0aW9ucykge1xuICAgICAgICAgICAgbGV0IHRvcGljSUQ6IHN0cmluZyA9IFwic2Nob29sXCIgKyBzY2hvb2wuU2Nob29sSUQ7XG4gICAgICAgICAgICBpZiAoaW5NeVNjaG9vbHMpIHtcbiAgICAgICAgICAgICAgICAvLyBTdWJzY3JpYmUgdG8gdGhlICd0b3BpYycgZm9yIG5vdGlmaWNhdGlvbnNcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwic3Vic2NyaWJlVG9Ub3BpYzogXCIgKyB0b3BpY0lEKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVUb1RvcGljKHRvcGljSUQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwidW5zdWJzY3JpYmVGcm9tVG9waWM6IFwiICsgdG9waWNJRCk7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmVGcm9tVG9waWModG9waWNJRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNoZWNrRGF0YWJhc2UoZXJyb3IpIHsgICAgICAgXG4gICAgICAgIGxldCBkYXRhYmFzZTogY291Y2hiYXNlLkNvdWNoYmFzZSA9IG5ldyBjb3VjaGJhc2UuQ291Y2hiYXNlKFwid3NtXCIpO1xuICAgICAgICBsZXQgc2Nob29scyA9IGRhdGFiYXNlLmdldERvY3VtZW50KFwic2Nob29sc1wiKTtcblxuICAgICAgICBpZiAoIXNjaG9vbHMpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgT2JqZWN0LmtleXMoc2Nob29scykubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZURhdGEoc2Nob29sc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhciAoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5wb3AoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBteVNjaG9vbHMoKSB7ICAgICAgIFxuICAgICAgICBsZXQgc3RyU2Nob29sczogc3RyaW5nID0gZ2V0U3RyaW5nKENvbmZpZy5hcHBTZXR0aW5nc19teVNjaG9vbHMpO1xuICAgICAgICBsZXQgYXJyU2Nob29sczogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgXG4gICAgICAgIGlmIChzdHJTY2hvb2xzKSB7XG4gICAgICAgICAgICBzdHJTY2hvb2xzLnNwbGl0KCcsJykuZm9yRWFjaChpdGVtID0+IGFyclNjaG9vbHMucHVzaChOdW1iZXIoaXRlbSkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnJTY2hvb2xzO1xuICAgIH1cblxuICAgIHNldCBteVNjaG9vbHMoc2Nob29sczogbnVtYmVyW10pIHtcbiAgICAgICAgc2V0U3RyaW5nKENvbmZpZy5hcHBTZXR0aW5nc19teVNjaG9vbHMsc2Nob29scy50b1N0cmluZygpKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlRXJyb3JzKHJlc3BvbnNlKSB7XG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICB0aHJvdyBFcnJvcihyZXNwb25zZS5zdGF0dXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzcG9uc2U7XG59Il19