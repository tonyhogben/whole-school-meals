"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ns_image_cache_common_1 = require("./ns-image-cache-common");
exports.srcProperty = ns_image_cache_common_1.srcProperty;
exports.isLoadingProperty = ns_image_cache_common_1.isLoadingProperty;
var view_1 = require("ui/core/view");
var application = require("application");
var utils = require("utils/utils");
var appSettings = require("application-settings");
var types = require("utils/types");
var fs = require("file-system");
exports.isInitialized = false;
var ScaleType;
(function (ScaleType) {
    ScaleType.none = "none";
    ScaleType.aspectFill = "aspectFill";
    ScaleType.aspectFit = "aspectFit";
    ScaleType.fill = "fill";
})(ScaleType = exports.ScaleType || (exports.ScaleType = {}));
exports.stretchProperty = new view_1.Property({
    name: "stretch",
    defaultValue: ScaleType.none,
    valueConverter: function (v) { return v; },
    affectsLayout: true
});
exports.stretchProperty.register(ns_image_cache_common_1.NSImageBase);
exports.radiusProperty = new view_1.Property({
    name: "radius",
    defaultValue: undefined,
    valueConverter: function (v) { return parseFloat(v); },
    affectsLayout: true
});
exports.radiusProperty.register(ns_image_cache_common_1.NSImageBase);
exports.roundedProperty = new view_1.Property({
    name: "rounded",
    defaultValue: false,
    valueConverter: view_1.booleanConverter,
    affectsLayout: true
});
exports.roundedProperty.register(ns_image_cache_common_1.NSImageBase);
exports.placeholderProperty = new view_1.Property({
    name: "placeholder",
    defaultValue: undefined,
    valueConverter: function (v) { return v; },
    affectsLayout: true
});
exports.placeholderProperty.register(ns_image_cache_common_1.NSImageBase);
exports.placeholderStretchProperty = new view_1.Property({
    name: "placeholderStretch",
    defaultValue: undefined,
    valueConverter: function (v) { return v; },
    affectsLayout: true
});
exports.placeholderStretchProperty.register(ns_image_cache_common_1.NSImageBase);
var ProxyBaseControllerListener = com.facebook.drawee.controller.BaseControllerListener.extend({
    _MyNSCachedImage: undefined,
    setMyNSCachedImage: function (img) {
        this._MyNSCachedImage = img;
    },
    onFinalImageSet: function (id, imageInfo, anim) {
        if (undefined != this._MyNSCachedImage) {
            this._MyNSCachedImage.isLoading = false;
        }
    },
    onIntermediateImageSet: function (id, imageInfo) { },
    onFailure: function (id, throwable) {
        console.log("onFailure", id, throwable);
    }
});
var NSImage = (function (_super) {
    __extends(NSImage, _super);
    function NSImage() {
        return _super.call(this) || this;
    }
    NSImage.prototype[ns_image_cache_common_1.srcProperty.getDefault] = function () {
        return undefined;
    };
    NSImage.prototype[ns_image_cache_common_1.srcProperty.setNative] = function (value) {
        if (value) {
            setSource(this, value);
        }
    };
    NSImage.prototype[exports.stretchProperty.getDefault] = function () {
        return ScaleType.none;
    };
    NSImage.prototype[exports.stretchProperty.setNative] = function (value) {
        if (value) {
            this.setNativeStretch(value);
        }
    };
    NSImage.prototype[exports.radiusProperty.getDefault] = function () {
        return undefined;
    };
    NSImage.prototype[exports.radiusProperty.setNative] = function (value) {
        if (value) {
            this.setRadius(value);
        }
    };
    NSImage.prototype[exports.roundedProperty.getDefault] = function () {
        return undefined;
    };
    NSImage.prototype[exports.roundedProperty.setNative] = function (value) {
        if (value) {
            this.setRounded(value);
        }
    };
    NSImage.prototype[exports.placeholderProperty.getDefault] = function () {
        return undefined;
    };
    NSImage.prototype[exports.placeholderProperty.setNative] = function (value) {
        if (value) {
            this.setPlaceholder(value, this.placeholderStretch);
        }
    };
    NSImage.prototype[exports.placeholderStretchProperty.getDefault] = function () {
        return undefined;
    };
    NSImage.prototype[exports.placeholderStretchProperty.setNative] = function (value) {
        if (value) { }
    };
    NSImage.prototype.setRadius = function (radius) {
        var roundingParams = new com.facebook.drawee.generic.RoundingParams.fromCornersRadius(0);
        roundingParams.setCornersRadius(radius);
        this.nativeView.getHierarchy().setRoundingParams(roundingParams);
    };
    NSImage.prototype.setRounded = function (rounded) {
        var roundingParams = new com.facebook.drawee.generic.RoundingParams.fromCornersRadius(0);
        if (rounded)
            roundingParams.setRoundAsCircle(true);
        else
            roundingParams.setRoundAsCircle(false);
        this.nativeView.getHierarchy().setRoundingParams(roundingParams);
    };
    NSImage.prototype.setPlaceholder = function (src, placeholderStretch) {
        var drawable = getPlaceholderImageDrawable(src), nativePlaceholderStretch = getScaleType[placeholderStretch] || getScaleType(ScaleType.none);
        if (null == drawable) {
            return;
        }
        this.nativeView.getHierarchy().setPlaceholderImage(drawable, nativePlaceholderStretch);
    };
    NSImage.prototype.setNativeStretch = function (stretch) {
        var frescoStretch = getScaleType(stretch) || getScaleType(ScaleType.none);
        this.nativeView.getHierarchy().setActualImageScaleType(frescoStretch);
    };
    NSImage.prototype.createNativeView = function () {
        this.nativeView = new com.facebook.drawee.view.SimpleDraweeView(this._context);
        if (undefined !== this.src) {
            setSource(this, this.src);
        }
        if (undefined !== this.stretch) {
            this.setNativeStretch(this.stretch);
        }
        if (undefined !== this.rounded) {
            this.setRounded(this.rounded);
        }
        if (undefined !== this.radius) {
            this.setRadius(this.radius);
        }
        if (undefined !== this.placeholder) {
            this.setPlaceholder(this.placeholder, this.placeholderStretch);
        }
        return this.nativeView;
    };
    return NSImage;
}(ns_image_cache_common_1.NSImageBase));
exports.NSImage = NSImage;
function setSource(image, value) {
    if (types.isString(value)) {
        value = value.trim();
        if (utils.isFileOrResourcePath(value) || 0 === value.indexOf("http")) {
            image.isLoading = true;
            var fileName = "";
            if (0 === value.indexOf("~/")) {
                fileName = fs.path.join(fs.knownFolders.currentApp().path, value.replace("~/", ""));
                fileName = "file:" + fileName;
            }
            else if (0 == value.indexOf("res")) {
                fileName = value;
                var res = utils.ad.getApplicationContext().getResources();
                var resName = fileName.substr(utils.RESOURCE_PREFIX.length);
                var identifier = res.getIdentifier(resName, 'drawable', utils.ad.getApplication().getPackageName());
                fileName = "res:/" + identifier;
            }
            else if (0 === value.indexOf("http")) {
                image.isLoading = true;
                fileName = value;
            }
            var request = com.facebook.imagepipeline.request.ImageRequestBuilder
                .newBuilderWithSource(android.net.Uri.parse(fileName))
                .setProgressiveRenderingEnabled(true)
                .build();
            var controllerListener = new ProxyBaseControllerListener();
            controllerListener.setMyNSCachedImage(image);
            var controller = com.facebook.drawee.backends.pipeline.Fresco
                .newDraweeControllerBuilder()
                .setImageRequest(request)
                .setControllerListener(controllerListener)
                .setOldController(image.android.getController())
                .setTapToRetryEnabled(true)
                .build();
            image.android.setController(controller);
            image.requestLayout();
        }
        else {
            throw new Error("Path \"" + "\" is not a valid file or resource.");
        }
    }
}
function getScaleType(scaleType) {
    if (types.isString(scaleType)) {
        switch (scaleType) {
            case ScaleType.none:
                return com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER;
            case ScaleType.aspectFill:
                return com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER_CROP;
            case ScaleType.aspectFit:
                return com.facebook.drawee.drawable.ScalingUtils.ScaleType.FIT_CENTER;
            case ScaleType.fill:
                return com.facebook.drawee.drawable.ScalingUtils.ScaleType.FIT_XY;
            default:
                break;
        }
    }
}
function getPlaceholderImageDrawable(value) {
    var fileName = "", drawable = null;
    if (types.isString(value)) {
        value = value.trim();
        if (utils.isFileOrResourcePath(value)) {
            if (0 === value.indexOf("~/")) {
                fileName = fs.path.join(fs.knownFolders.currentApp().path, value.replace("~/", ""));
                drawable = android.graphics.drawable.Drawable.createFromPath(fileName);
            }
            else if (0 == value.indexOf("res")) {
                fileName = value;
                var res = utils.ad.getApplicationContext().getResources();
                var resName = fileName.substr(utils.RESOURCE_PREFIX.length);
                var identifier = res.getIdentifier(resName, 'drawable', utils.ad.getApplication().getPackageName());
                drawable = res.getDrawable(identifier);
            }
        }
    }
    return drawable;
}
function setCacheLimit(numberOfDays) {
    var noOfSecondsInAMinute = 60, noOfMinutesInAHour = 60, noOfHoursInADay = 24, noOfSecondsADay = noOfSecondsInAMinute * noOfMinutesInAHour * noOfHoursInADay, noOfSecondsInDays = noOfSecondsADay * numberOfDays, currentSeconds = Math.round(new Date().getTime() / 1000), referenceTime = 0;
    if (true == appSettings.getBoolean("isAppOpenedFirstTime") || undefined == appSettings.getBoolean("isAppOpenedFirstTime") || null == appSettings.getBoolean("isAppOpenedFirstTime")) {
        appSettings.setBoolean("isAppOpenedFirstTime", false);
        com.facebook.drawee.backends.pipeline.Fresco.getImagePipeline().clearCaches();
        appSettings.setNumber("cacheTimeReference", currentSeconds);
    }
    else {
        referenceTime = appSettings.getNumber("cacheTimeReference");
        if (null == referenceTime || undefined == referenceTime) {
            appSettings.setNumber("cacheTimeReference", currentSeconds);
        }
        else if ((currentSeconds - referenceTime) > noOfSecondsInDays) {
            clearCache();
            appSettings.setNumber("cacheTimeReference", currentSeconds);
        }
    }
}
exports.setCacheLimit = setCacheLimit;
function initialize() {
    com.facebook.drawee.backends.pipeline.Fresco.initialize(application.android.context);
}
exports.initialize = initialize;
function clearCache() {
    com.facebook.drawee.backends.pipeline.Fresco.getImagePipeline().clearCaches();
}
exports.clearCache = clearCache;
function initializeOnAngular() {
    if (false === exports.isInitialized) {
        var _elementRegistry = require("nativescript-angular/element-registry");
        _elementRegistry.registerElement("NSImage", function () {
            return require("nativescript-image-cache").NSImage;
        });
        initialize();
        exports.isInitialized = true;
    }
}
exports.initializeOnAngular = initializeOnAngular;
