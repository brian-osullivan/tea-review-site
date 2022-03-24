const { DateTime } = require("luxon");
const embedYouTube = require("eleventy-plugin-youtube-embed");
const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const metagen = require("eleventy-plugin-metagen");

// Generate responsive images
const Image = require("@11ty/eleventy-img");
const path = require('path');

const widths = [300, 700, 1400];
const formats = ['webp', 'jpeg'];
const sizes = '100vw';

const isUrl = (str) => {
  try {
    return ['http:', 'https:'].includes(new URL(str).protocol)
  } catch {
    return false
  }
}

  const imageShortcode = async ( src, alt ) => {

    if (alt === undefined) throw new Error(`Missing 'alt' on responsive image from: ${src}`)

    const srcPath = isUrl(src) ? src : path.join('./src/img/', src)
    const imgDir = isUrl(src) ? '' : path.parse(src).dir

    const metadata = await Image(srcPath, {
      widths,
      formats,
      outputDir: path.join('_site/img', imgDir),
      urlPath: '/img' + imgDir,
    })

    const markup = Image.generateHTML(metadata, {
      alt,
      sizes,
      loading: 'lazy',
      decoding: 'async',
      class: 'object-cover rounded',
    })

    return `<figure>${markup}<figcaption>${alt}</figcaption></figure>`
  }

const now = String(Date.now());


module.exports = (config) => {
  config.addPassthroughCopy({ 'public': './' });
  // Copy `img/` to `_site/img`
  config.addPassthroughCopy("src/img");
  config.addPlugin(embedYouTube);
  config.addPlugin(metagen);
  config.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://www.walkerteareview.com/",
    },
  });
  // add Image shortcode
  config.addNunjucksAsyncShortcode("image", imageShortcode);
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
    templateFormats: ["html", "md", "njk", "yml"]
  }
}
