const path = require('path');

module.exports = (eleventyConfig) => {
    // eleventyConfig.setNunjucksEnvironmentOptions({
    // });

    const opts = {
        dir: {
            input: "elements",
        }
    };

    console.log('opts', opts);
    return opts;
};
