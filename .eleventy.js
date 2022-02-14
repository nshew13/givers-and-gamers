const DIR_INTERMEDIATE = 'src';

module.exports = (eleventyConfig) => {
    eleventyConfig.addPassthroughCopy('templates/**/*.css');
    eleventyConfig.addPassthroughCopy('templates/**/*.html');
    eleventyConfig.addPassthroughCopy('templates/**/*.js');
    eleventyConfig.addPassthroughCopy('templates/**/*.scss');
    eleventyConfig.addPassthroughCopy('templates/**/*.ts');

    return {
        dir: {
            input: 'templates',
            output: DIR_INTERMEDIATE,
        },
        templateFormats: ['njk'],
    };
};
