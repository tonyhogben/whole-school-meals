"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = require("ui/frame");
function back() {
    frame_1.goBack();
}
exports.back = back;
function schools() {
    var navigationEntry = {
        moduleName: "views/schools/schools",
        context: { settings: true },
        animated: false
    };
    frame_1.topmost().navigate(navigationEntry);
}
exports.schools = schools;
function allergens() {
    var navigationEntry = {
        moduleName: "views/allergens/allergens",
        context: { settings: true },
        animated: false
    };
    frame_1.topmost().navigate(navigationEntry);
}
exports.allergens = allergens;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtDQUEyQztBQUUzQztJQUNJLGNBQU0sRUFBRSxDQUFDO0FBQ2IsQ0FBQztBQUZELG9CQUVDO0FBRUQ7SUFDSSxJQUFJLGVBQWUsR0FBRztRQUNsQixVQUFVLEVBQUUsdUJBQXVCO1FBQ25DLE9BQU8sRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7UUFDM0IsUUFBUSxFQUFFLEtBQUs7S0FDbEIsQ0FBQztJQUNGLGVBQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBUEQsMEJBT0M7QUFFRDtJQUNJLElBQUksZUFBZSxHQUFHO1FBQ2xCLFVBQVUsRUFBRSwyQkFBMkI7UUFDdkMsT0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtRQUMzQixRQUFRLEVBQUUsS0FBSztLQUNsQixDQUFDO0lBQ0YsZUFBTyxFQUFFLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFQRCw4QkFPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHRvcG1vc3QsIGdvQmFjayB9IGZyb20gXCJ1aS9mcmFtZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gYmFjaygpIHtcbiAgICBnb0JhY2soKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNjaG9vbHMoKSB7XG4gICAgdmFyIG5hdmlnYXRpb25FbnRyeSA9IHtcbiAgICAgICAgbW9kdWxlTmFtZTogXCJ2aWV3cy9zY2hvb2xzL3NjaG9vbHNcIixcbiAgICAgICAgY29udGV4dDogeyBzZXR0aW5nczogdHJ1ZSB9LFxuICAgICAgICBhbmltYXRlZDogZmFsc2VcbiAgICB9O1xuICAgIHRvcG1vc3QoKS5uYXZpZ2F0ZShuYXZpZ2F0aW9uRW50cnkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWxsZXJnZW5zKCkge1xuICAgIHZhciBuYXZpZ2F0aW9uRW50cnkgPSB7XG4gICAgICAgIG1vZHVsZU5hbWU6IFwidmlld3MvYWxsZXJnZW5zL2FsbGVyZ2Vuc1wiLFxuICAgICAgICBjb250ZXh0OiB7IHNldHRpbmdzOiB0cnVlIH0sXG4gICAgICAgIGFuaW1hdGVkOiBmYWxzZVxuICAgIH07XG4gICAgdG9wbW9zdCgpLm5hdmlnYXRlKG5hdmlnYXRpb25FbnRyeSk7XG59Il19