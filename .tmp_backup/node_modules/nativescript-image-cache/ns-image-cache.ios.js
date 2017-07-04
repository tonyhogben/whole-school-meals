"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ns_image_cache_common_1 = require("./ns-image-cache-common");
exports.srcProperty = ns_image_cache_common_1.srcProperty;
exports.isLoadingProperty = ns_image_cache_common_1.isLoadingProperty;
var view_1 = require("ui/core/view");
var utils = require("utils/utils");
var appSettings = require("application-settings");
var types = require("utils/types");
var imageSource = require("image-source");
var utils_1 = require("utils/utils");
exports.isInitialized = false;
exports.placeholderProperty = new view_1.Property({
    name: "placeholder",
    defaultValue: undefined,
    valueConverter: function (v) { return v; },
    affectsLayout: true
});
exports.placeholderProperty.register(ns_image_cache_common_1.NSImageBase);
exports.stretchProperty = new view_1.Property({
    name: "stretch",
    defaultValue: "aspectFit",
    affectsLayout: true
});
exports.stretchProperty.register(ns_image_cache_common_1.NSImageBase);
var NSImage = (function (_super) {
    __extends(NSImage, _super);
    function NSImage() {
        var _this = _super.call(this) || this;
        _this._imageSourceAffectsLayout = true;
        _this.nativeView = new UIImageView();
        _this.nativeView.contentMode = UIViewContentMode.ScaleAspectFit;
        _this.nativeView.clipsToBounds = true;
        _this.nativeView.userInteractionEnabled = true;
        return _this;
    }
    NSImage.prototype[ns_image_cache_common_1.srcProperty.getDefault] = function () {
        return undefined;
    };
    NSImage.prototype[ns_image_cache_common_1.srcProperty.setNative] = function (value) {
        if (value) {
            setSource(this, value);
        }
    };
    NSImage.prototype[exports.placeholderProperty.getDefault] = function () {
        return undefined;
    };
    NSImage.prototype[exports.placeholderProperty.setNative] = function (value) {
        if (value) { }
    };
    NSImage.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = utils_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils_1.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils_1.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils_1.layout.getMeasureSpecMode(heightMeasureSpec);
        var nativeWidth = this.nativeView ? utils_1.layout.toDevicePixels(this.getMeasuredWidth()) : 0;
        var nativeHeight = this.nativeView ? utils_1.layout.toDevicePixels(this.getMeasuredHeight()) : 0;
        var measureWidth = Math.max(nativeWidth, this.effectiveMinWidth);
        var measureHeight = Math.max(nativeHeight, this.effectiveMinHeight);
        var finiteWidth = widthMode !== utils_1.layout.UNSPECIFIED;
        var finiteHeight = heightMode !== utils_1.layout.UNSPECIFIED;
        this._imageSourceAffectsLayout = widthMode !== utils_1.layout.EXACTLY || heightMode !== utils_1.layout.EXACTLY;
        if (nativeWidth !== 0 && nativeHeight !== 0 && (finiteWidth || finiteHeight)) {
            var scale = NSImage.computeScaleFactor(width, height, finiteWidth, finiteHeight, nativeWidth, nativeHeight, this.stretch);
            var resultW = Math.round(nativeWidth * scale.width);
            var resultH = Math.round(nativeHeight * scale.height);
            measureWidth = finiteWidth ? Math.min(resultW, width) : resultW;
            measureHeight = finiteHeight ? Math.min(resultH, height) : resultH;
            var trace = require("trace");
            trace.write("Image stretch: " + this.stretch +
                ", nativeWidth: " + nativeWidth +
                ", nativeHeight: " + nativeHeight, trace.categories.Layout);
        }
        var view = require("ui/core/view");
        var widthAndState = view.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = view.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    NSImage.computeScaleFactor = function (measureWidth, measureHeight, widthIsFinite, heightIsFinite, nativeWidth, nativeHeight, imageStretch) {
        var scaleW = 1;
        var scaleH = 1;
        if ((imageStretch === "aspectFill" || imageStretch === "aspectFit" || imageStretch === "fill") &&
            (widthIsFinite || heightIsFinite)) {
            scaleW = (nativeWidth > 0) ? measureWidth / nativeWidth : 0;
            scaleH = (nativeHeight > 0) ? measureHeight / nativeHeight : 0;
            if (!widthIsFinite) {
                scaleW = scaleH;
            }
            else if (!heightIsFinite) {
                scaleH = scaleW;
            }
            else {
                switch (imageStretch) {
                    case "aspectFit":
                        scaleH = scaleW < scaleH ? scaleW : scaleH;
                        scaleW = scaleH;
                        break;
                    case "aspectFill":
                        scaleH = scaleW > scaleH ? scaleW : scaleH;
                        scaleW = scaleH;
                        break;
                }
            }
        }
        return { width: scaleW, height: scaleH };
    };
    NSImage.prototype[exports.stretchProperty.getDefault] = function () {
        return "aspectFit";
    };
    NSImage.prototype[exports.stretchProperty.setNative] = function (value) {
        switch (value) {
            case "aspectFit":
                this.nativeView.contentMode = UIViewContentMode.ScaleAspectFit;
                break;
            case "aspectFill":
                this.nativeView.contentMode = UIViewContentMode.ScaleAspectFill;
                break;
            case "fill":
                this.nativeView.contentMode = UIViewContentMode.ScaleToFill;
                break;
            case "none":
            default:
                this.nativeView.contentMode = UIViewContentMode.TopLeft;
                break;
        }
    };
    return NSImage;
}(ns_image_cache_common_1.NSImageBase));
exports.NSImage = NSImage;
function setSource(image, value) {
    var placeholder = image.placeholder, placeholderImage = getPlaceholderUIImage(placeholder);
    if (types.isString(value)) {
        value = value.trim();
        if (0 === value.indexOf("http")) {
            image.isLoading = true;
            image["_url"] = value;
            image.ios.sd_setImageWithURLPlaceholderImageCompleted(value, placeholderImage, function () {
                image.isLoading = false;
            });
        }
        else if (utils.isFileOrResourcePath(value)) {
            image.isLoading = true;
            var source = new imageSource.ImageSource();
            if (0 === value.indexOf(utils.RESOURCE_PREFIX)) {
                var path = value.substr(utils.RESOURCE_PREFIX.length);
                source.fromResource(path).then(function () {
                    image.isLoading = false;
                    image.ios.image = source.ios;
                });
            }
            else {
                source.fromFile(value).then(function () {
                    image.isLoading = false;
                    image.ios.image = source.ios;
                });
            }
        }
        image.requestLayout();
    }
}
function getPlaceholderUIImage(value) {
    if (types.isString(value)) {
        if (utils.isFileOrResourcePath(value)) {
            return imageSource.fromFileOrResource(value).ios;
        }
    }
    return undefined;
}
function setCacheLimit(numberOfDays) {
    var noOfSecondsInAMinute = 60, noOfMinutesInAHour = 60, noOfHoursInADay = 24, noOfSecondsADay = noOfSecondsInAMinute * noOfMinutesInAHour * noOfHoursInADay, noOfSecondsInDays = noOfSecondsADay * numberOfDays, currentSeconds = Math.round(new Date().getTime() / 1000), referenceTime = 0;
    if (true == appSettings.getBoolean("isAppOpenedFirstTime") || undefined == appSettings.getBoolean("isAppOpenedFirstTime") || null == appSettings.getBoolean("isAppOpenedFirstTime")) {
        appSettings.setBoolean("isAppOpenedFirstTime", false);
        clearCache();
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
function clearCache() {
    var imageCache = SDImageCache.sharedImageCache();
    imageCache.clearMemory();
    imageCache.clearDisk();
}
exports.clearCache = clearCache;
function initializeOnAngular() {
    if (false === exports.isInitialized) {
        var _elementRegistry = require("nativescript-angular/element-registry");
        _elementRegistry.registerElement("NSImage", function () {
            return require("nativescript-image-cache").NSImage;
        });
        exports.isInitialized = true;
    }
}
exports.initializeOnAngular = initializeOnAngular;
;
