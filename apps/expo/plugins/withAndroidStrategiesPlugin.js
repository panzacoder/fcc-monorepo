const { withAppBuildGradle } = require("@expo/config-plugins");

module.exports = function withAndroidStrategiesPlugin(config) {
    return withAppBuildGradle(config, (config) => {
        config.modResults.contents += `
android { defaultConfig { missingDimensionStrategy "store", "play" } }`;
        return config;
    });
};