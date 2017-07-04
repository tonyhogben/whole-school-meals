"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("data/observable");
var models_1 = require("../shared/models");
var allergens_vm_1 = require("../view-models/allergens-vm");
var couchbase = require("nativescript-couchbase");
var allergenList = new allergens_vm_1.AllergenList;
var Menu = (function (_super) {
    __extends(Menu, _super);
    function Menu() {
        return _super.call(this) || this;
    }
    Menu.prototype.load = function (date) {
        var _this = this;
        return fetch(models_1.Config.apiUrl + "menu.ashx?d=" + date)
            .then(handleErrors)
            .then(function (response) {
            return response.json();
        }).then(function (data) {
            _this.handleData(data);
            // Add to local db
            var database = new couchbase.Couchbase("wsm");
            var menu = database.getDocument(date);
            if (!menu) {
                database.createDocument(data, date);
            }
            else {
                database.updateDocument(date, data);
            }
        })
            .catch(function (error) {
            _this.checkDatabase(date, error);
        });
    };
    Menu.prototype.checkDatabase = function (date, error) {
        var database = new couchbase.Couchbase("wsm");
        var menu = database.getDocument(date);
        if (!menu) {
            throw Error(error);
        }
        else {
            this.handleData(menu);
        }
    };
    Menu.prototype.handleData = function (data) {
        if (data) {
            this.set("menuDate", data.MenuDate);
            this.set("calendarId", data.CalendarID);
            this.set("main1", this.makeDish(data.Main1, data.CalendarID, data.MenuDate));
            this.set("main2", this.makeDish(data.Main2, data.CalendarID, data.MenuDate));
            this.set("side1", this.makeDish(data.Side1, data.CalendarID, data.MenuDate));
            this.set("side2", this.makeDish(data.Side2, data.CalendarID, data.MenuDate));
            this.set("side3", this.makeDish(data.Side3, data.CalendarID, data.MenuDate));
            this.set("side4", this.makeDish(data.Side4, data.CalendarID, data.MenuDate));
            this.set("side5", this.makeDish(data.Side5, data.CalendarID, data.MenuDate));
            this.set("dessert1", this.makeDish(data.Dessert1, data.CalendarID, data.MenuDate));
            this.set("dessert2", this.makeDish(data.Dessert2, data.CalendarID, data.MenuDate));
            this.set("dessert3", this.makeDish(data.Dessert3, data.CalendarID, data.MenuDate));
            this.set("dessert4", this.makeDish(data.Dessert4, data.CalendarID, data.MenuDate));
        }
    };
    Menu.prototype.makeDish = function (jsonObj, calendarId, menuDate) {
        if (jsonObj) {
            // Setup dish object
            var dish_1 = {
                id: jsonObj.DishID,
                calendarId: calendarId,
                menuDate: menuDate,
                name: jsonObj.Name,
                description: jsonObj.Description,
                description_html: "</style><div style=\"font-family: Arial, Helvetica, sans-serif;\">" + jsonObj.DescriptionHTML + "</div>",
                vegetarian: jsonObj.Vegetarian,
                ingredients: [],
                allergens: [],
                hasYourAllergens: false,
                yourAllergenCount: 0,
                yourAllergenMessage: "",
                hasGallery: false,
                photos: []
            };
            // Ingredients
            var ingredientStr_1 = [];
            jsonObj.Ingredients.forEach(function (ingredient) {
                var ing = {
                    id: ingredient.IngredientID,
                    name: ingredient.Ingredient,
                    vegetarian: ingredient.Vegetarian,
                    measurementId: ingredient.MeasurementID,
                    heading: ingredient.Heading,
                    allergens: [],
                };
                var allergensStr = [];
                if (ingredient.Allergens) {
                    ingredient.Allergens.forEach(function (allergen) {
                        if (!allergen.Deleted) {
                            ing.allergens.push({
                                id: allergen.AllergenID,
                                name: allergen.Allergen
                            });
                            allergensStr.push(allergen.Allergen);
                        }
                    });
                }
                if (!ingredient.Heading) {
                    if (allergensStr.length > 0) {
                        ingredientStr_1.push(ingredient.Ingredient + " (" + allergensStr.toString() + ")");
                    }
                    else {
                        ingredientStr_1.push(ingredient.Ingredient);
                    }
                }
                dish_1.ingredients.push(ing);
            });
            dish_1.ingredientList = ingredientStr_1.join(', ');
            // Allergens
            var allergensStr_1 = [];
            var yourAllergensStr_1 = [];
            jsonObj.Allergens.forEach(function (allergen) {
                if (!allergen.Deleted) {
                    dish_1.allergens.push({
                        id: allergen.AllergenID,
                        name: allergen.Allergen
                    });
                    allergensStr_1.push(allergen.Allergen);
                    if (allergenList.myAllergens.includes(allergen.AllergenID)) {
                        yourAllergensStr_1.push(allergen.Allergen);
                    }
                }
            });
            dish_1.allergenList = allergensStr_1.join(', ');
            // Has your allergens?
            if (yourAllergensStr_1.length > 0) {
                dish_1.yourAllergens = yourAllergensStr_1.join(', ');
                dish_1.hasYourAllergens = true;
                dish_1.yourAllergenCount = yourAllergensStr_1.length;
                dish_1.yourAllergenMessage = dish_1.name + " contains " + dish_1.yourAllergenCount + " of your allergens";
            }
            // Photos
            jsonObj.Photos.forEach(function (photo, index) {
                if (index == 0) {
                    dish_1.photo = photo.URL;
                }
                dish_1.photos.push({
                    url: photo.URL,
                    caption: photo.Caption
                });
            });
            if (!dish_1.photo) {
                dish_1.photo = "~/images/" + models_1.Config.noImagePaths[Math.floor(Math.random() * models_1.Config.noImagePaths.length)];
            }
            if (dish_1.photos.length > 1) {
                dish_1.hasGallery = true;
            }
            // Return the dish
            return dish_1;
        }
        else {
            return {
                id: 0,
                calendarId: 0,
                menuDate: new Date(),
                name: '',
                description: '',
                description_html: '',
                vegetarian: false,
                hasYourAllergens: false,
                yourAllergenCount: 0,
                yourAllergenMessage: "",
                photo: ""
            };
        }
    };
    return Menu;
}(observable_1.Observable));
exports.Menu = Menu;
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.status);
    }
    return response;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS12bS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1lbnUtdm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4Q0FBNkM7QUFDN0MsMkNBQXNGO0FBQ3RGLDREQUEyRDtBQUMzRCxrREFBb0Q7QUFFcEQsSUFBSSxZQUFZLEdBQUcsSUFBSSwyQkFBWSxDQUFDO0FBRXBDO0lBQTBCLHdCQUFVO0lBZWhDO2VBQ0ksaUJBQU87SUFDWCxDQUFDO0lBRUQsbUJBQUksR0FBSixVQUFLLElBQUk7UUFBVCxpQkFvQkM7UUFuQkcsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFNLENBQUMsTUFBTSxHQUFHLGNBQWMsR0FBRyxJQUFJLENBQUM7YUFDOUMsSUFBSSxDQUFDLFlBQVksQ0FBQzthQUNsQixJQUFJLENBQUMsVUFBQSxRQUFRO1lBQ1YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO1lBQ1IsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV0QixrQkFBa0I7WUFDbEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlDLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4QyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLFVBQUEsS0FBSztZQUNSLEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVPLDRCQUFhLEdBQXJCLFVBQXNCLElBQVksRUFBRSxLQUFLO1FBQ3JDLElBQUksUUFBUSxHQUF3QixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkUsSUFBSSxJQUFJLEdBQVksUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUixNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFCLENBQUM7SUFDTCxDQUFDO0lBRU8seUJBQVUsR0FBbEIsVUFBbUIsSUFBSTtRQUNuQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1AsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM3RSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM3RSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM3RSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM3RSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM3RSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM3RSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM3RSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNuRixJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNuRixJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJ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LEVBQUU7Z0JBQ3BCLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixnQkFBZ0IsRUFBRSxLQUFLO2dCQUN2QixpQkFBaUIsRUFBRSxDQUFDO2dCQUNwQixtQkFBbUIsRUFBRSxFQUFFO2dCQUN2QixLQUFLLEVBQUUsRUFBRTthQUNaLENBQUM7UUFDTixDQUFDO0lBQ0wsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUFDLEFBL0xELENBQTBCLHVCQUFVLEdBK0xuQztBQS9MWSxvQkFBSTtBQWlNakIsc0JBQXNCLFFBQVE7SUFDMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNmLE1BQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gXCJkYXRhL29ic2VydmFibGVcIjtcbmltcG9ydCB7IENvbmZpZywgRGlzaCwgSW5ncmVkaWVudCwgQWxsZXJnZW4sIFBob3RvLCBEYXlNZW51IH0gZnJvbSBcIi4uL3NoYXJlZC9tb2RlbHNcIjtcbmltcG9ydCB7IEFsbGVyZ2VuTGlzdCB9IGZyb20gJy4uL3ZpZXctbW9kZWxzL2FsbGVyZ2Vucy12bSc7XG5pbXBvcnQgKiBhcyBjb3VjaGJhc2UgZnJvbSBcIm5hdGl2ZXNjcmlwdC1jb3VjaGJhc2VcIjtcblxudmFyIGFsbGVyZ2VuTGlzdCA9IG5ldyBBbGxlcmdlbkxpc3Q7XG5cbmV4cG9ydCBjbGFzcyBNZW51IGV4dGVuZHMgT2JzZXJ2YWJsZSBpbXBsZW1lbnRzIERheU1lbnUge1xuICAgIG1lbnVEYXRlOiBEYXRlO1xuICAgIGNhbGVuZGFySWQ6IG51bWJlcjtcbiAgICBtYWluMTogRGlzaDtcbiAgICBtYWluMjogRGlzaDtcbiAgICBzaWRlMTogRGlzaDtcbiAgICBzaWRlMjogRGlzaDtcbiAgICBzaWRlMzogRGlzaDtcbiAgICBzaWRlNDogRGlzaDtcbiAgICBzaWRlNTogRGlzaDtcbiAgICBkZXNzZXJ0MTogRGlzaDtcbiAgICBkZXNzZXJ0MjogRGlzaDtcbiAgICBkZXNzZXJ0MzogRGlzaDtcbiAgICBkZXNzZXJ0NDogRGlzaDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBcbiAgICBsb2FkKGRhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKENvbmZpZy5hcGlVcmwgKyBcIm1lbnUuYXNoeD9kPVwiICsgZGF0ZSlcbiAgICAgICAgICAgIC50aGVuKGhhbmRsZUVycm9ycylcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgfSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZURhdGEoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgdG8gbG9jYWwgZGJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YWJhc2UgPSBuZXcgY291Y2hiYXNlLkNvdWNoYmFzZShcIndzbVwiKTtcbiAgICAgICAgICAgICAgICBsZXQgbWVudSA9IGRhdGFiYXNlLmdldERvY3VtZW50KGRhdGUpO1xuICAgICAgICAgICAgICAgIGlmICghbWVudSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhYmFzZS5jcmVhdGVEb2N1bWVudChkYXRhLCBkYXRlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhYmFzZS51cGRhdGVEb2N1bWVudChkYXRlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrRGF0YWJhc2UoZGF0ZSwgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja0RhdGFiYXNlKGRhdGU6IHN0cmluZywgZXJyb3IpIHsgICAgICAgXG4gICAgICAgIGxldCBkYXRhYmFzZTogY291Y2hiYXNlLkNvdWNoYmFzZSA9IG5ldyBjb3VjaGJhc2UuQ291Y2hiYXNlKFwid3NtXCIpO1xuICAgICAgICBsZXQgbWVudTogRGF5TWVudSA9IGRhdGFiYXNlLmdldERvY3VtZW50KGRhdGUpO1xuICAgICAgICBpZiAoIW1lbnUpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRGF0YShtZW51KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlRGF0YShkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnNldChcIm1lbnVEYXRlXCIsIGRhdGEuTWVudURhdGUpO1xuICAgICAgICAgICAgdGhpcy5zZXQoXCJjYWxlbmRhcklkXCIsIGRhdGEuQ2FsZW5kYXJJRCk7XG4gICAgICAgICAgICB0aGlzLnNldChcIm1haW4xXCIsIHRoaXMubWFrZURpc2goZGF0YS5NYWluMSwgZGF0YS5DYWxlbmRhcklELCBkYXRhLk1lbnVEYXRlKSk7XG4gICAgICAgICAgICB0aGlzLnNldChcIm1haW4yXCIsIHRoaXMubWFrZURpc2goZGF0YS5NYWluMiwgZGF0YS5DYWxlbmRhcklELCBkYXRhLk1lbnVEYXRlKSk7XG4gICAgICAgICAgICB0aGlzLnNldChcInNpZGUxXCIsIHRoaXMubWFrZURpc2goZGF0YS5TaWRlMSwgZGF0YS5DYWxlbmRhcklELCBkYXRhLk1lbnVEYXRlKSk7XG4gICAgICAgICAgICB0aGlzLnNldChcInNpZGUyXCIsIHRoaXMubWFrZURpc2goZGF0YS5TaWRlMiwgZGF0YS5DYWxlbmRhcklELCBkYXRhLk1lbnVEYXRlKSk7XG4gICAgICAgICAgICB0aGlzLnNldChcInNpZGUzXCIsIHRoaXMubWFrZURpc2goZGF0YS5TaWRlMywgZGF0YS5DYWxlbmRhcklELCBkYXRhLk1lbnVEYXRlKSk7XG4gICAgICAgICAgICB0aGlzLnNldChcInNpZGU0XCIsIHRoaXMubWFrZURpc2goZGF0YS5TaWRlNCwgZGF0YS5DYWxlbmRhcklELCBkYXRhLk1lbnVEYXRlKSk7XG4gICAgICAgICAgICB0aGlzLnNldChcInNpZGU1XCIsIHRoaXMubWFrZURpc2goZGF0YS5TaWRlNSwgZGF0YS5DYWxlbmRhcklELCBkYXRhLk1lbnVEYXRlKSk7XG4gICAgICAgICAgICB0aGlzLnNldChcImRlc3NlcnQxXCIsIHRoaXMubWFrZURpc2goZGF0YS5EZXNzZXJ0MSwgZGF0YS5DYWxlbmRhcklELCBkYXRhLk1lbnVEYXRlKSk7XG4gICAgICAgICAgICB0aGlzLnNldChcImRlc3NlcnQyXCIsIHRoaXMubWFrZURpc2goZGF0YS5EZXNzZXJ0MiwgZGF0YS5DYWxlbmRhcklELCBkYXRhLk1lbnVEYXRlKSk7XG4gICAgICAgICAgICB0aGlzLnNldChcImRlc3NlcnQzXCIsIHRoaXMubWFrZURpc2goZGF0YS5EZXNzZXJ0MywgZGF0YS5DYWxlbmRhcklELCBkYXRhLk1lbnVEYXRlKSk7XG4gICAgICAgICAgICB0aGlzLnNldChcImRlc3NlcnQ0XCIsIHRoaXMubWFrZURpc2goZGF0YS5EZXNzZXJ0NCwgZGF0YS5DYWxlbmRhcklELCBkYXRhLk1lbnVEYXRlKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG1ha2VEaXNoKGpzb25PYmosIGNhbGVuZGFySWQsIG1lbnVEYXRlKTogRGlzaCB7XG4gICAgICAgIGlmIChqc29uT2JqKSB7ICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gU2V0dXAgZGlzaCBvYmplY3RcbiAgICAgICAgICAgIGxldCBkaXNoOiBEaXNoID0ge1xuICAgICAgICAgICAgICAgIGlkOiBqc29uT2JqLkRpc2hJRCxcbiAgICAgICAgICAgICAgICBjYWxlbmRhcklkOiBjYWxlbmRhcklkLFxuICAgICAgICAgICAgICAgIG1lbnVEYXRlOiBtZW51RGF0ZSxcbiAgICAgICAgICAgICAgICBuYW1lOiBqc29uT2JqLk5hbWUsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGpzb25PYmouRGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb25faHRtbDogYDwvc3R5bGU+PGRpdiBzdHlsZT1cImZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1wiPiR7anNvbk9iai5EZXNjcmlwdGlvbkhUTUx9PC9kaXY+YCxcbiAgICAgICAgICAgICAgICB2ZWdldGFyaWFuOiBqc29uT2JqLlZlZ2V0YXJpYW4sXG4gICAgICAgICAgICAgICAgaW5ncmVkaWVudHM6IFtdLFxuICAgICAgICAgICAgICAgIGFsbGVyZ2VuczogW10sXG4gICAgICAgICAgICAgICAgaGFzWW91ckFsbGVyZ2VuczogZmFsc2UsXG4gICAgICAgICAgICAgICAgeW91ckFsbGVyZ2VuQ291bnQ6IDAsXG4gICAgICAgICAgICAgICAgeW91ckFsbGVyZ2VuTWVzc2FnZTogXCJcIixcbiAgICAgICAgICAgICAgICBoYXNHYWxsZXJ5OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwaG90b3M6IFtdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBJbmdyZWRpZW50c1xuICAgICAgICAgICAgbGV0IGluZ3JlZGllbnRTdHI6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICBqc29uT2JqLkluZ3JlZGllbnRzLmZvckVhY2goaW5ncmVkaWVudCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGluZzogSW5ncmVkaWVudCA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGluZ3JlZGllbnQuSW5ncmVkaWVudElELFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBpbmdyZWRpZW50LkluZ3JlZGllbnQsXG4gICAgICAgICAgICAgICAgICAgIHZlZ2V0YXJpYW46IGluZ3JlZGllbnQuVmVnZXRhcmlhbixcbiAgICAgICAgICAgICAgICAgICAgbWVhc3VyZW1lbnRJZDogaW5ncmVkaWVudC5NZWFzdXJlbWVudElELFxuICAgICAgICAgICAgICAgICAgICBoZWFkaW5nOiBpbmdyZWRpZW50LkhlYWRpbmcsXG4gICAgICAgICAgICAgICAgICAgIGFsbGVyZ2VuczogW10sXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGFsbGVyZ2Vuc1N0cjogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoaW5ncmVkaWVudC5BbGxlcmdlbnMpIHsgXG4gICAgICAgICAgICAgICAgICAgIGluZ3JlZGllbnQuQWxsZXJnZW5zLmZvckVhY2goYWxsZXJnZW4gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhbGxlcmdlbi5EZWxldGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5nLmFsbGVyZ2Vucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFsbGVyZ2VuLkFsbGVyZ2VuSUQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGFsbGVyZ2VuLkFsbGVyZ2VuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxlcmdlbnNTdHIucHVzaChhbGxlcmdlbi5BbGxlcmdlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghaW5ncmVkaWVudC5IZWFkaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbGxlcmdlbnNTdHIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5ncmVkaWVudFN0ci5wdXNoKGluZ3JlZGllbnQuSW5ncmVkaWVudCArIFwiIChcIiArIGFsbGVyZ2Vuc1N0ci50b1N0cmluZygpICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5ncmVkaWVudFN0ci5wdXNoKGluZ3JlZGllbnQuSW5ncmVkaWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZGlzaC5pbmdyZWRpZW50cy5wdXNoKGluZyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRpc2guaW5ncmVkaWVudExpc3QgPSBpbmdyZWRpZW50U3RyLmpvaW4oJywgJyk7XG5cbiAgICAgICAgICAgIC8vIEFsbGVyZ2Vuc1xuICAgICAgICAgICAgbGV0IGFsbGVyZ2Vuc1N0cjogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgIGxldCB5b3VyQWxsZXJnZW5zU3RyOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBqc29uT2JqLkFsbGVyZ2Vucy5mb3JFYWNoKGFsbGVyZ2VuID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWFsbGVyZ2VuLkRlbGV0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzaC5hbGxlcmdlbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogYWxsZXJnZW4uQWxsZXJnZW5JRCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGFsbGVyZ2VuLkFsbGVyZ2VuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGFsbGVyZ2Vuc1N0ci5wdXNoKGFsbGVyZ2VuLkFsbGVyZ2VuKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYWxsZXJnZW5MaXN0Lm15QWxsZXJnZW5zLmluY2x1ZGVzKGFsbGVyZ2VuLkFsbGVyZ2VuSUQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB5b3VyQWxsZXJnZW5zU3RyLnB1c2goYWxsZXJnZW4uQWxsZXJnZW4pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRpc2guYWxsZXJnZW5MaXN0ID0gYWxsZXJnZW5zU3RyLmpvaW4oJywgJyk7XG5cbiAgICAgICAgICAgIC8vIEhhcyB5b3VyIGFsbGVyZ2Vucz9cbiAgICAgICAgICAgIGlmICh5b3VyQWxsZXJnZW5zU3RyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBkaXNoLnlvdXJBbGxlcmdlbnMgPSB5b3VyQWxsZXJnZW5zU3RyLmpvaW4oJywgJyk7XG4gICAgICAgICAgICAgICAgZGlzaC5oYXNZb3VyQWxsZXJnZW5zID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkaXNoLnlvdXJBbGxlcmdlbkNvdW50ID0geW91ckFsbGVyZ2Vuc1N0ci5sZW5ndGg7XG4gICAgICAgICAgICAgICAgZGlzaC55b3VyQWxsZXJnZW5NZXNzYWdlID0gIGAke2Rpc2gubmFtZX0gY29udGFpbnMgJHtkaXNoLnlvdXJBbGxlcmdlbkNvdW50fSBvZiB5b3VyIGFsbGVyZ2Vuc2BcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUGhvdG9zXG4gICAgICAgICAgICBqc29uT2JqLlBob3Rvcy5mb3JFYWNoKChwaG90bywgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBkaXNoLnBob3RvID0gcGhvdG8uVVJMO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkaXNoLnBob3Rvcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBwaG90by5VUkwsXG4gICAgICAgICAgICAgICAgICAgIGNhcHRpb246IHBob3RvLkNhcHRpb25cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCFkaXNoLnBob3RvKSB7XG4gICAgICAgICAgICAgICAgZGlzaC5waG90byA9IFwifi9pbWFnZXMvXCIgKyBDb25maWcubm9JbWFnZVBhdGhzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIENvbmZpZy5ub0ltYWdlUGF0aHMubGVuZ3RoKV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGlzaC5waG90b3MubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIGRpc2guaGFzR2FsbGVyeSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJldHVybiB0aGUgZGlzaFxuICAgICAgICAgICAgcmV0dXJuIGRpc2g7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGlkOiAwLFxuICAgICAgICAgICAgICAgIGNhbGVuZGFySWQ6IDAsXG4gICAgICAgICAgICAgICAgbWVudURhdGU6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAgICAgbmFtZTogJycsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uX2h0bWw6ICcnLFxuICAgICAgICAgICAgICAgIHZlZ2V0YXJpYW46IGZhbHNlLFxuICAgICAgICAgICAgICAgIGhhc1lvdXJBbGxlcmdlbnM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHlvdXJBbGxlcmdlbkNvdW50OiAwLFxuICAgICAgICAgICAgICAgIHlvdXJBbGxlcmdlbk1lc3NhZ2U6IFwiXCIsXG4gICAgICAgICAgICAgICAgcGhvdG86IFwiXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUVycm9ycyhyZXNwb25zZSkge1xuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgdGhyb3cgRXJyb3IocmVzcG9uc2Uuc3RhdHVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xufSJdfQ==