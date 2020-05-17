function isSnippet (page) {
  return page.snippet;
}

const wrapSnippet = (markdown) => `
<section class="snippet">
  ${markdown}
</section>
`;

function addSnippetData (page) {
  page.content = page.content
    .split("---")
    .map(wrapSnippet)
    .join("");
}

module.exports = function (site, cb) {
  site.filter(isSnippet)
    .forEach(addSnippetData);
  cb(null, site);
}
