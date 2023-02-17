const fs = require("fs");
const Sitemapper = require("sitemapper");
const sitemap = new Sitemapper({});
function groupUrls(url_list) {
  let temp = [];
  /*
  stackoverflow gem right here - https://stackoverflow.com/a/42328706
  Use an object and group by domain and by the first string after the domain. Then iterate the tree and reduce it to the wanted structure
  */
  url_list.forEach(
    function (a) {
      var m = a.match(/.*?:\/\/([^\/]+)\/?([^\/?]+)?/);
      m.shift();
      m.reduce(function (r, b) {
        if (!r[b]) {
          r[b] = { _: [] };
          r._.push({ name: b, children: r[b]._ });
        }
        return r[b];
      }, this)._.push(a);
    },
    { _: temp }
  );

  let result = temp.reduce(function (r, a) {
    var top = [],
      parts = [];

    a.children.forEach(function (b) {
      if (b.children.length === 1) {
        top.push(b.children[0]);
      } else {
        parts.push(b.children);
      }
    });
    return top.length ? r.concat([top], parts) : r.concat(parts);
  }, []);
  return result;
}

async function main() {
  var url_list = [],
    result;

  try {
    let allSitemaps = [
      // WHOLEFOODS
      "https://wholefoodsmarket.com/sitemap.xml"
      // DICKS SPORTING GOODS
      // "https://www.dickssportinggoods.com/seo_sitemap.xml"
      // TARGET
      // "https://www.target.com/sitemap_index.xml.gz",
      // "https://www.target.com/sitemap_image_index.xml.gz",
      // "https://www.target.com/sitemap_video_index.xml.gz",
      // "https://www.target.com/b/sitemap_001.xml.gz"
    ];

    let files = [];
    let count = 1;
    let groupCount = 1;
    for await (a of allSitemaps) {
      await sitemap.fetch(a).then(async function (sites) {
        // sort sitemap urls
        sites.sites = sites.sites.sort();

        // save sorted sitemap urls to file
        let filename = `urls_${count}.csv`;
        files.push(filename);
        fs.writeFileSync(filename, sites.sites.join("\n"));
        count++;

        // group urls by section and save to file
        result = groupUrls(sites.sites);
        for await (r of result) {
          fs.writeFileSync(`group_${groupCount}.txt`, r.join("\n"));
          groupCount++;
        }
      });
    }
  } catch (e) {
    console.log("CAUGHT", e);
    process.exit(0);
  }
}
main();
