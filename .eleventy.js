const { DateTime } = require("luxon");
const embedYouTube = require("eleventy-plugin-youtube-embed");
const sitemap = require("@quasibit/eleventy-plugin-sitemap");

module.exports = (config) => {
  config.addPassthroughCopy({ 'public': './' });
  // Copy `img/` to `_site/img`
  config.addPassthroughCopy("src/img");
  config.addPlugin(embedYouTube);
  config.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://www.walkerteareview.com/",
    },
  });
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
