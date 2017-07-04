"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_array_1 = require("data/observable-array");
var application_settings_1 = require("application-settings");
var models_1 = require("../shared/models");
var couchbase = require("nativescript-couchbase");
var AllergenList = (function (_super) {
    __extends(AllergenList, _super);
    function AllergenList() {
        return _super.call(this) || this;
    }
    AllergenList.prototype.load = function () {
        var _this = this;
        return fetch(models_1.Config.apiUrl + "allergens.ashx")
            .then(handleErrors)
            .then(function (response) {
            return response.json();
        }).then(function (data) {
            // Process the list of schools
            data.forEach(function (allergen) {
                _this.handleData(allergen);
            });
            // Add to local db
            var database = new couchbase.Couchbase("wsm");
            var allergens = database.getDocument("allergens");
            if (!allergens) {
                database.createDocument(data, "allergens");
            }
            else {
                database.updateDocument("allergens", data);
            }
        }).catch(function (error) {
            _this.checkDatabase(error);
        });
    };
    AllergenList.prototype.handleData = function (allergen) {
        // Has the user saved this allergen in their prefs?
        var inMyAllergens = false;
        if (this.myAllergens) {
            inMyAllergens = this.myAllergens.includes(allergen.AllergenID);
        }
        this.push({
            name: allergen.Allergen,
            id: allergen.AllergenID,
            selected: inMyAllergens
        });
    };
    AllergenList.prototype.checkDatabase = function (error) {
        var database = new couchbase.Couchbase("wsm");
        var allergens = database.getDocument("allergens");
        if (!allergens) {
            throw Error(error);
        }
        else {
            for (var i = 0; i < Object.keys(allergens).length; i++) {
                console.log(allergens[i]);
                this.handleData(allergens[i]);
            }
        }
    };
    AllergenList.prototype.clear = function () {
        while (this.length) {
            this.pop();
        }
    };
    ;
    Object.defineProperty(AllergenList.prototype, "myAllergens", {
        get: function () {
            var strAllergens = application_settings_1.getString(models_1.Config.appSettings_myAllergens);
            var arrAllergens = [];
            if (strAllergens) {
                strAllergens.split(',').forEach(function (item) { return arrAllergens.push(Number(item)); });
            }
            return arrAllergens;
        },
        set: function (allergens) {
            application_settings_1.setString(models_1.Config.appSettings_myAllergens, allergens.toString());
        },
        enumerable: true,
        configurable: true
    });
    return AllergenList;
}(observable_array_1.ObservableArray));
exports.AllergenList = AllergenList;
function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsZXJnZW5zLXZtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWxsZXJnZW5zLXZtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMERBQXdEO0FBQ3hELDZEQUE0RDtBQUM1RCwyQ0FBb0Q7QUFDcEQsa0RBQW9EO0FBRXBEO0lBQWtDLGdDQUF5QjtJQUN2RDtlQUNJLGlCQUFPO0lBQ1gsQ0FBQztJQUVELDJCQUFJLEdBQUo7UUFBQSxpQkFzQkM7UUFyQkcsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFNLENBQUMsTUFBTSxHQUFHLGdCQUFnQixDQUFDO2FBQ3pDLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDbEIsSUFBSSxDQUFDLFVBQVMsUUFBUTtZQUNuQixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUk7WUFDUiw4QkFBOEI7WUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFFBQVE7Z0JBQ2pCLEtBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUIsQ0FBQyxDQUFDLENBQUM7WUFFSCxrQkFBa0I7WUFDbEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlDLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNiLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQy9DLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMvQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsS0FBSztZQUNW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IE9ic2VydmFibGVBcnJheSB9IGZyb20gJ2RhdGEvb2JzZXJ2YWJsZS1hcnJheSc7XG5pbXBvcnQgeyBnZXRTdHJpbmcsIHNldFN0cmluZyB9IGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuaW1wb3J0IHsgQ29uZmlnLCBBbGxlcmdlbiB9IGZyb20gJy4uL3NoYXJlZC9tb2RlbHMnO1xuaW1wb3J0ICogYXMgY291Y2hiYXNlIGZyb20gXCJuYXRpdmVzY3JpcHQtY291Y2hiYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBBbGxlcmdlbkxpc3QgZXh0ZW5kcyBPYnNlcnZhYmxlQXJyYXk8QWxsZXJnZW4+IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTsgICAgICAgXG4gICAgfVxuXG4gICAgbG9hZCgpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKENvbmZpZy5hcGlVcmwgKyBcImFsbGVyZ2Vucy5hc2h4XCIpXG4gICAgICAgICAgICAudGhlbihoYW5kbGVFcnJvcnMpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICB9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFByb2Nlc3MgdGhlIGxpc3Qgb2Ygc2Nob29sc1xuICAgICAgICAgICAgICAgIGRhdGEuZm9yRWFjaChhbGxlcmdlbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRGF0YShhbGxlcmdlbik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgdG8gbG9jYWwgZGJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YWJhc2UgPSBuZXcgY291Y2hiYXNlLkNvdWNoYmFzZShcIndzbVwiKTtcbiAgICAgICAgICAgICAgICBsZXQgYWxsZXJnZW5zID0gZGF0YWJhc2UuZ2V0RG9jdW1lbnQoXCJhbGxlcmdlbnNcIik7XG4gICAgICAgICAgICAgICAgaWYgKCFhbGxlcmdlbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YWJhc2UuY3JlYXRlRG9jdW1lbnQoZGF0YSwgXCJhbGxlcmdlbnNcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YWJhc2UudXBkYXRlRG9jdW1lbnQoXCJhbGxlcmdlbnNcIiwgZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tEYXRhYmFzZShlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZURhdGEoYWxsZXJnZW4pIHsgICAgICAgICAgICAgIFxuICAgICAgICAvLyBIYXMgdGhlIHVzZXIgc2F2ZWQgdGhpcyBhbGxlcmdlbiBpbiB0aGVpciBwcmVmcz9cbiAgICAgICAgbGV0IGluTXlBbGxlcmdlbnM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMubXlBbGxlcmdlbnMpIHtcbiAgICAgICAgICAgIGluTXlBbGxlcmdlbnMgPSB0aGlzLm15QWxsZXJnZW5zLmluY2x1ZGVzKGFsbGVyZ2VuLkFsbGVyZ2VuSUQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6IGFsbGVyZ2VuLkFsbGVyZ2VuLFxuICAgICAgICAgICAgaWQ6IGFsbGVyZ2VuLkFsbGVyZ2VuSUQsXG4gICAgICAgICAgICBzZWxlY3RlZDogaW5NeUFsbGVyZ2Vuc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNoZWNrRGF0YWJhc2UoZXJyb3IpIHtcbiAgICAgICAgbGV0IGRhdGFiYXNlOiBjb3VjaGJhc2UuQ291Y2hiYXNlID0gbmV3IGNvdWNoYmFzZS5Db3VjaGJhc2UoXCJ3c21cIik7XG4gICAgICAgIGxldCBhbGxlcmdlbnMgPSBkYXRhYmFzZS5nZXREb2N1bWVudChcImFsbGVyZ2Vuc1wiKTtcblxuICAgICAgICBpZiAoIWFsbGVyZ2Vucykge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBPYmplY3Qua2V5cyhhbGxlcmdlbnMpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYWxsZXJnZW5zW2ldKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZURhdGEoYWxsZXJnZW5zW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyICgpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnBvcCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGdldCBteUFsbGVyZ2VucygpIHsgICAgICAgXG4gICAgICAgIGxldCBzdHJBbGxlcmdlbnM6IHN0cmluZyA9IGdldFN0cmluZyhDb25maWcuYXBwU2V0dGluZ3NfbXlBbGxlcmdlbnMpO1xuICAgICAgICBsZXQgYXJyQWxsZXJnZW5zOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBcbiAgICAgICAgaWYgKHN0ckFsbGVyZ2Vucykge1xuICAgICAgICAgICAgc3RyQWxsZXJnZW5zLnNwbGl0KCcsJykuZm9yRWFjaChpdGVtID0+IGFyckFsbGVyZ2Vucy5wdXNoKE51bWJlcihpdGVtKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFyckFsbGVyZ2VucztcbiAgICB9XG5cbiAgICBzZXQgbXlBbGxlcmdlbnMoYWxsZXJnZW5zOiBudW1iZXJbXSkge1xuICAgICAgICBzZXRTdHJpbmcoQ29uZmlnLmFwcFNldHRpbmdzX215QWxsZXJnZW5zLGFsbGVyZ2Vucy50b1N0cmluZygpKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlRXJyb3JzKHJlc3BvbnNlKSB7XG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXNwb25zZSkpO1xuICAgICAgICB0aHJvdyBFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xufSJdfQ==