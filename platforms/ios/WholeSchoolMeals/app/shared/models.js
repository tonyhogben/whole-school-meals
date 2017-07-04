//export class School {
//constructor(
//id: number,
//name: string,
//town: string,
//favourite?: boolean
//) {}
//}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config = (function () {
    function Config() {
    }
    return Config;
}());
Config.apiUrl = "http://app.wholeschoolmeals.co.uk/api/";
Config.appSettings_mySchools = "my-schools";
Config.appSettings_myAllergens = "my-allergens";
Config.noImagePaths = [
    "no_image_broccoli.jpg",
    "no_image_leek.jpg",
    "no_image_carrot.jpg",
    "no_image_strawberry.jpg",
    "no_image_pumpkin.jpg"
];
exports.Config = Config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kZWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHVCQUF1QjtBQUNyQixjQUFjO0FBQ1osYUFBYTtBQUNiLGVBQWU7QUFDZixlQUFlO0FBQ2YscUJBQXFCO0FBQ3ZCLE1BQU07QUFDUixHQUFHOzs7QUFFSDtJQUFBO0lBV0EsQ0FBQztJQUFELGFBQUM7QUFBRCxDQUFDLEFBWEQ7QUFDb0IsYUFBTSxHQUFHLHdDQUF3QyxDQUFDO0FBQ2xELDRCQUFxQixHQUFHLFlBQVksQ0FBQztBQUNyQyw4QkFBdUIsR0FBRyxjQUFjLENBQUM7QUFDekMsbUJBQVksR0FBRztJQUMzQix1QkFBdUI7SUFDdkIsbUJBQW1CO0lBQ25CLHFCQUFxQjtJQUNyQix5QkFBeUI7SUFDekIsc0JBQXNCO0NBQ3pCLENBQUM7QUFWTyx3QkFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8vZXhwb3J0IGNsYXNzIFNjaG9vbCB7XG4gIC8vY29uc3RydWN0b3IoXG4gICAgLy9pZDogbnVtYmVyLFxuICAgIC8vbmFtZTogc3RyaW5nLFxuICAgIC8vdG93bjogc3RyaW5nLFxuICAgIC8vZmF2b3VyaXRlPzogYm9vbGVhblxuICAvLykge31cbi8vfVxuXG5leHBvcnQgY2xhc3MgQ29uZmlnIHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgYXBpVXJsID0gXCJodHRwOi8vYXBwLndob2xlc2Nob29sbWVhbHMuY28udWsvYXBpL1wiO1xuICAgIHN0YXRpYyByZWFkb25seSBhcHBTZXR0aW5nc19teVNjaG9vbHMgPSBcIm15LXNjaG9vbHNcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgYXBwU2V0dGluZ3NfbXlBbGxlcmdlbnMgPSBcIm15LWFsbGVyZ2Vuc1wiO1xuICAgIHN0YXRpYyByZWFkb25seSBub0ltYWdlUGF0aHMgPSBbXG4gICAgICAgIFwibm9faW1hZ2VfYnJvY2NvbGkuanBnXCIsXG4gICAgICAgIFwibm9faW1hZ2VfbGVlay5qcGdcIixcbiAgICAgICAgXCJub19pbWFnZV9jYXJyb3QuanBnXCIsXG4gICAgICAgIFwibm9faW1hZ2Vfc3RyYXdiZXJyeS5qcGdcIixcbiAgICAgICAgXCJub19pbWFnZV9wdW1wa2luLmpwZ1wiXG4gICAgXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTY2hvb2wge1xuICAgIGlkOiBudW1iZXIsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHRvd246IHN0cmluZyxcbiAgICBzZWxlY3RlZD86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBBbGxlcmdlbiB7XG4gICAgaWQ6IG51bWJlcixcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgc2VsZWN0ZWQ/OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW5ncmVkaWVudCB7XG4gICAgaWQ6IG51bWJlcixcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgdmVnZXRhcmlhbjogYm9vbGVhbixcbiAgICBtZWFzdXJlbWVudElkOiBudW1iZXIsXG4gICAgaGVhZGluZzogYm9vbGVhbixcbiAgICBhbGxlcmdlbnM6IEFsbGVyZ2VuW11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBQaG90byB7XG4gICAgdXJsOiBzdHJpbmcsXG4gICAgY2FwdGlvbjogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGlzaCB7XG4gICAgaWQ6IG51bWJlcixcbiAgICBjYWxlbmRhcklkOiBudW1iZXIsXG4gICAgbWVudURhdGU6IERhdGUsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcsXG4gICAgZGVzY3JpcHRpb25faHRtbDogc3RyaW5nLFxuICAgIHZlZ2V0YXJpYW46IGJvb2xlYW4sXG4gICAgYWxsZXJnZW5zPzogQWxsZXJnZW5bXSxcbiAgICBhbGxlcmdlbkxpc3Q/OiBzdHJpbmcsXG4gICAgaGFzWW91ckFsbGVyZ2VuczogYm9vbGVhbixcbiAgICB5b3VyQWxsZXJnZW5zPzogc3RyaW5nLFxuICAgIHlvdXJBbGxlcmdlbkNvdW50PzogbnVtYmVyLFxuICAgIHlvdXJBbGxlcmdlbk1lc3NhZ2U/OiBzdHJpbmc7XG4gICAgaW5ncmVkaWVudHM/OiBJbmdyZWRpZW50W10sXG4gICAgaW5ncmVkaWVudExpc3Q/OiBzdHJpbmcsXG4gICAgcGhvdG8/OiBzdHJpbmcsXG4gICAgaGFzR2FsbGVyeT86IGJvb2xlYW4sXG4gICAgcGhvdG9zPzogUGhvdG9bXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIERheU1lbnUge1xuICAgIG1lbnVEYXRlOiBEYXRlLFxuICAgIGNhbGVuZGFySWQ6IG51bWJlcixcbiAgICBtYWluMTogRGlzaCxcbiAgICBtYWluMjogRGlzaCxcbiAgICBzaWRlMTogRGlzaCxcbiAgICBzaWRlMjogRGlzaCxcbiAgICBzaWRlMzogRGlzaCxcbiAgICBzaWRlNDogRGlzaCxcbiAgICBzaWRlNTogRGlzaCxcbiAgICBkZXNzZXJ0MTogRGlzaCxcbiAgICBkZXNzZXJ0MjogRGlzaCxcbiAgICBkZXNzZXJ0MzogRGlzaCxcbiAgICBkZXNzZXJ0NDogRGlzaFxufSJdfQ==