const markdownIt = require("markdown-it")
const markdownItAttrs = require('markdown-it-attrs');
const htmlmin = require("html-minifier")

const isProduction = process.env.NODE_ENV === 'production'

module.exports = function(config) {
  config.dir = {
    input: './src',
    output: "./public"
  }

  config.setDataDeepMerge(true)

  config.setTemplateFormats([
    'njk',
    'md',
    'jpg',
    'png',
    'svg',
    // 'liquid',
    // 'pug',
    // 'ejs',
    // 'hbs',
    // 'mustache',
    // 'haml',
    // '11ty.js',
  ])

  const markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true
  }

  config.addNunjucksFilter("dateTimeString", function(date) {
    return date.toLocaleDateString("de-DE");
  });

  config.addNunjucksFilter("starRating", function(rating) {
    let result = '';
    for (let i = 0; i < rating; i++) {
      if (i === 0) {
        result += '<span class="color-orange">'
      }
      result += '★';
      if (i == rating-1) {
        result += '</span>'
      }
    }
    for (let i = 0; i < 5-rating; i++) {
      result += '★';
    }
    console.log(result)
    return result;
  });

  config.setLibrary("md",
                    markdownIt(markdownItOptions)
                    .use(markdownItAttrs))

  config.addTransform("htmlmin", function(content, outputPath) {
    if(isProduction && outputPath.endsWith(".html")){
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      })

      return minified
    }

    return content
  })

  return config
}
