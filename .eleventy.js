const { DateTime } = require("luxon");

module.exports = (config) => {
  config.addPassthroughCopy({ 'public': './' });
  // Copy `img/` to `_site/img`
  config.addPassthroughCopy("src/img");
  config.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });
  config.setBrowserSyncConfig({
    files: ['dist/**/*'],
    open: true,
  })
  return {
    dir: {
      input: 'src',
      output: '_site',
    },
    markdownTemplateEngine: 'njk',
  }
}
