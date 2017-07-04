"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_array_1 = require("data/observable-array");
var application_settings_1 = require("application-settings");
var models_1 = require("../shared/models");
var couchbase = require("nativescript-couchbase");
var SchoolList = (function (_super) {
    __extends(SchoolList, _super);
    function SchoolList() {
        return _super.call(this) || this;
    }
    SchoolList.prototype.load = function () {
        var _this = this;
        return fetch(models_1.Config.apiUrl + "schools.ashx")
            .then(handleErrors)
            .then(function (response) {
            return response.json();
        }).then(function (data) {
            // Process the list of schools
            data.forEach(function (school) {
                _this.handleData(school);
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
        }).catch(function (error) {
            _this.checkDatabase(error);
        });
    };
    SchoolList.prototype.handleData = function (school) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nob29scy12bS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNjaG9vbHMtdm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwREFBd0Q7QUFDeEQsNkRBQTREO0FBQzVELDJDQUFrRDtBQUNsRCxrREFBb0Q7QUFFcEQ7SUFBZ0MsOEJBQXVCO0lBQ25EO2VBQ0ksaUJBQU87SUFDWCxDQUFDO0lBRUQseUJBQUksR0FBSjtRQUFBLGlCQXNCQztRQXJCRyxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQU0sQ0FBQyxNQUFNLEdBQUcsY0FBYyxDQUFDO2FBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDbEIsSUFBSSxDQUFDLFVBQVMsUUFBUTtZQUNuQixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUk7WUFDUiw4QkFBOEI7WUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU07Z0JBQ2YsS0FBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QixDQUFDLENBQUMsQ0FBQztZQUVILGtCQUFrQjtZQUNsQixJQUFJLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUMsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM5QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDN0MsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzdDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQSxLQUFLO1lBQ1YsS0FBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFTywrQkFBVSxHQUFsQixVQUFtQixNQUFNO1FBQ3JCLGlEQUFpRDtRQUNqRCxJQUFJLFdBQVcsR0FBWSxLQUFLLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDakIsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNOLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtZQUNqQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7WUFDakIsRUFBRSxFQUFFLE1BQU0sQ0FBQyxRQUFRO1lBQ25CLFFBQVEsRUFBRSxXQUFXO1NBQ3hCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxrQ0FBYSxHQUFyQixVQUFzQixLQUFLO1FBQ3ZCLElBQUksUUFBUSxHQUF3QixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkUsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU5QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDWCxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUQsMEJBQUssR0FBTDtRQUNJLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNmLENBQUM7SUFDTCxDQUFDO0lBRUQsc0JBQUksaUNBQVM7YUFBYjtZQUNJLElBQUksVUFBVSxHQUFXLGdDQUFTLENBQUMsZUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDakUsSUFBSSxVQUFVLEdBQWEsRUFBRSxDQUFDO1lBRTlCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUE3QixDQUE2QixDQUFDLENBQUM7WUFDekUsQ0FBQztZQUVELE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDdEIsQ0FBQzthQUVELFVBQWMsT0FBaUI7WUFDM0IsZ0NBQVMsQ0FBQyxlQUFNLENBQUMscUJBQXFCLEVBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7UUFDOUQsQ0FBQzs7O09BSkE7SUFLTCxpQkFBQztBQUFELENBQUMsQUE3RUQsQ0FBZ0Msa0NBQWUsR0E2RTlDO0FBN0VZLGdDQUFVO0FBK0V2QixzQkFBc0IsUUFBUTtJQUMxQixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ3BCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlQXJyYXkgfSBmcm9tICdkYXRhL29ic2VydmFibGUtYXJyYXknO1xuaW1wb3J0IHsgZ2V0U3RyaW5nLCBzZXRTdHJpbmcgfSBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcbmltcG9ydCB7IENvbmZpZywgU2Nob29sIH0gZnJvbSAnLi4vc2hhcmVkL21vZGVscyc7XG5pbXBvcnQgKiBhcyBjb3VjaGJhc2UgZnJvbSBcIm5hdGl2ZXNjcmlwdC1jb3VjaGJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIFNjaG9vbExpc3QgZXh0ZW5kcyBPYnNlcnZhYmxlQXJyYXk8U2Nob29sPiB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7ICAgICAgIFxuICAgIH1cblxuICAgIGxvYWQoKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChDb25maWcuYXBpVXJsICsgXCJzY2hvb2xzLmFzaHhcIilcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZUVycm9ycylcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIH0pLnRoZW4oZGF0YSA9PiB7ICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gUHJvY2VzcyB0aGUgbGlzdCBvZiBzY2hvb2xzXG4gICAgICAgICAgICAgICAgZGF0YS5mb3JFYWNoKHNjaG9vbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRGF0YShzY2hvb2wpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gQWRkIHRvIGxvY2FsIGRiXG4gICAgICAgICAgICAgICAgbGV0IGRhdGFiYXNlID0gbmV3IGNvdWNoYmFzZS5Db3VjaGJhc2UoXCJ3c21cIik7XG4gICAgICAgICAgICAgICAgbGV0IHNjaG9vbHMgPSBkYXRhYmFzZS5nZXREb2N1bWVudChcInNjaG9vbHNcIik7XG4gICAgICAgICAgICAgICAgaWYgKCFzY2hvb2xzKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFiYXNlLmNyZWF0ZURvY3VtZW50KGRhdGEsIFwic2Nob29sc1wiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhYmFzZS51cGRhdGVEb2N1bWVudChcInNjaG9vbHNcIiwgZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tEYXRhYmFzZShlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZURhdGEoc2Nob29sKSB7ICAgICAgICAgICAgICBcbiAgICAgICAgLy8gSGFzIHRoZSB1c2VyIHNhdmVkIHRoaXMgc2Nob29sIGluIHRoZWlyIHByZWZzP1xuICAgICAgICBsZXQgaW5NeVNjaG9vbHM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMubXlTY2hvb2xzKSB7XG4gICAgICAgICAgICBpbk15U2Nob29scyA9IHRoaXMubXlTY2hvb2xzLmluY2x1ZGVzKHNjaG9vbC5TY2hvb2xJRCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnB1c2goe1xuICAgICAgICAgICAgbmFtZTogc2Nob29sLk5hbWUsXG4gICAgICAgICAgICB0b3duOiBzY2hvb2wuVG93bixcbiAgICAgICAgICAgIGlkOiBzY2hvb2wuU2Nob29sSUQsXG4gICAgICAgICAgICBzZWxlY3RlZDogaW5NeVNjaG9vbHNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja0RhdGFiYXNlKGVycm9yKSB7ICAgICAgIFxuICAgICAgICBsZXQgZGF0YWJhc2U6IGNvdWNoYmFzZS5Db3VjaGJhc2UgPSBuZXcgY291Y2hiYXNlLkNvdWNoYmFzZShcIndzbVwiKTtcbiAgICAgICAgbGV0IHNjaG9vbHMgPSBkYXRhYmFzZS5nZXREb2N1bWVudChcInNjaG9vbHNcIik7XG5cbiAgICAgICAgaWYgKCFzY2hvb2xzKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE9iamVjdC5rZXlzKHNjaG9vbHMpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVEYXRhKHNjaG9vbHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXIgKCkge1xuICAgICAgICB3aGlsZSAodGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMucG9wKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgbXlTY2hvb2xzKCkgeyAgICAgICBcbiAgICAgICAgbGV0IHN0clNjaG9vbHM6IHN0cmluZyA9IGdldFN0cmluZyhDb25maWcuYXBwU2V0dGluZ3NfbXlTY2hvb2xzKTtcbiAgICAgICAgbGV0IGFyclNjaG9vbHM6IG51bWJlcltdID0gW107XG4gICAgICAgIFxuICAgICAgICBpZiAoc3RyU2Nob29scykge1xuICAgICAgICAgICAgc3RyU2Nob29scy5zcGxpdCgnLCcpLmZvckVhY2goaXRlbSA9PiBhcnJTY2hvb2xzLnB1c2goTnVtYmVyKGl0ZW0pKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJyU2Nob29scztcbiAgICB9XG5cbiAgICBzZXQgbXlTY2hvb2xzKHNjaG9vbHM6IG51bWJlcltdKSB7XG4gICAgICAgIHNldFN0cmluZyhDb25maWcuYXBwU2V0dGluZ3NfbXlTY2hvb2xzLHNjaG9vbHMudG9TdHJpbmcoKSlcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUVycm9ycyhyZXNwb25zZSkge1xuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgdGhyb3cgRXJyb3IocmVzcG9uc2Uuc3RhdHVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xufSJdfQ==