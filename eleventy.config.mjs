import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import markdownIt from "markdown-it";
import markdownItKatex from "markdown-it-katex";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import rssPlugin from "@11ty/eleventy-plugin-rss";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const site = JSON.parse(
  fs.readFileSync(path.join(__dirname, "src/_data/site.json"), "utf8")
);
const siteBase = site.url.replace(/\/?$/, "/");

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  /** Filters: dateToRfc822, htmlBaseUrl, renderTransforms, getNewestCollectionItemDate, … — used by [src/feed.njk](src/feed.njk). */
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addNunjucksGlobal("siteBaseUrl", siteBase);

  // Trusted author content only: html:true allows embeds; untrusted Markdown would be unsafe.
  eleventyConfig.setLibrary(
    "md",
    markdownIt({
      html: true,
      linkify: true,
      typographer: true,
    }).use(markdownItKatex, {
      throwOnError: false,
      errorColor: " #cc0000",
    })
  );

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({
    "publications.bib": "publications.bib",
  });

  eleventyConfig.addFilter("pubYear", (issued) => {
    const parts = issued && issued["date-parts"];
    if (!parts || !parts[0] || parts[0][0] == null) return "";
    return String(parts[0][0]);
  });

  eleventyConfig.addFilter("formatAuthors", (authors) => {
    if (!authors || !authors.length) return "";
    return authors
      .map((a) => {
        if (typeof a === "string") return a;
        const fam = a.family || "";
        const giv = a.given || "";
        return giv ? `${fam}, ${giv}` : fam;
      })
      .join("; ");
  });

  eleventyConfig.addFilter("sortNews", (items) => {
    if (!items) return [];
    return [...items].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  });

  eleventyConfig.addFilter("sortPosts", (items) => {
    if (!items || !items.length) return [];
    return [...items].sort((a, b) => {
      const da = a.data?.date ? new Date(a.data.date).getTime() : 0;
      const db = b.data?.date ? new Date(b.data.date).getTime() : 0;
      return db - da;
    });
  });

  function postTimestamp(post) {
    const raw = post.date != null ? post.date : post.data?.date;
    if (raw == null) return null;
    const t = raw instanceof Date ? raw.getTime() : new Date(raw).getTime();
    return Number.isNaN(t) ? null : t;
  }

  /** YYYY-MM-DD in UTC for lexicographic compare. */
  function isoDayUtc(ms) {
    return new Date(ms).toISOString().slice(0, 10);
  }

  /** Newest first; post date on or after the same calendar day one year ago (UTC); max maxCount (default 4). */
  eleventyConfig.addFilter("recentBlogPosts", (items, maxCount = 4) => {
    if (!items || !items.length) return [];
    const limit = Number(maxCount) > 0 ? Number(maxCount) : 4;
    const today = new Date();
    const cutoffCal = new Date(
      Date.UTC(today.getUTCFullYear() - 1, today.getUTCMonth(), today.getUTCDate())
    );
    const cutoffStr = cutoffCal.toISOString().slice(0, 10);
    const sorted = [...items].sort((a, b) => {
      const ta = postTimestamp(a) ?? 0;
      const tb = postTimestamp(b) ?? 0;
      return tb - ta;
    });
    return sorted
      .filter((p) => {
        const t = postTimestamp(p);
        if (t == null) return false;
        return isoDayUtc(t) >= cutoffStr;
      })
      .slice(0, limit);
  });

  /**
   * News entries from _data (YYYY-MM-DD `date`); newest first; same UTC calendar cutoff as `recentBlogPosts`.
   */
  eleventyConfig.addFilter("recentNewsItems", (items, maxCount = 3) => {
    if (!items || !items.length) return [];
    const limit = Number(maxCount) > 0 ? Number(maxCount) : 3;
    const today = new Date();
    const cutoffCal = new Date(
      Date.UTC(today.getUTCFullYear() - 1, today.getUTCMonth(), today.getUTCDate())
    );
    const cutoffStr = cutoffCal.toISOString().slice(0, 10);
    const sorted = [...items].sort((a, b) =>
      String(b.date).localeCompare(String(a.date))
    );
    return sorted
      .filter((item) => {
        if (item?.date == null) return false;
        const day = String(item.date).slice(0, 10);
        return day >= cutoffStr;
      })
      .slice(0, limit);
  });

  /** ISO date (YYYY-MM-DD) for <time datetime> and feeds */
  eleventyConfig.addFilter("isoDate", (value) => {
    if (value == null || value === "") return "";
    const dt = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(dt.getTime())) return String(value);
    return dt.toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("readableDate", (value) => {
    if (value == null || value === "") return "";
    const dt = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(dt.getTime())) return String(value);
    return dt.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("doiUrl", (doi) => {
    if (!doi) return "";
    const d = String(doi).replace(/^\s*https?:\/\/doi\.org\//i, "").trim();
    return `https://doi.org/${d}`;
  });

  eleventyConfig.addFilter("pubVenue", (pub) => {
    if (!pub) return "";
    if (pub.type === "thesis") return pub.publisher || "";
    if (pub["container-title"]) return pub["container-title"];
    return pub.publisher || "";
  });

  function pdfArchiveLabel(url) {
    let host;
    try {
      host = new URL(String(url).trim())
        .hostname.toLowerCase()
        .replace(/^www\./, "");
    } catch {
      return "PDF";
    }
    if (host.includes("hal.archives-ouvertes") || host.includes("hal.science"))
      return "HAL";
    if (host.includes("arxiv.org")) return "arXiv";
    if (host.includes("acm.org")) return "ACM";
    if (host.includes("ieee")) return "IEEE";
    if (host.includes("openaccess.thecvf.com") || host === "cvf.openaccess.thecvf.com")
      return "CVF";
    if (host.includes("zenodo.org")) return "Zenodo";
    if (host.includes("springer")) return "Springer";
    if (
      host.includes("elsevier") ||
      host.includes("sciencedirect") ||
      host.includes("linkinghub")
    )
      return "Elsevier";
    if (host.includes("mdpi.com")) return "MDPI";
    if (host.includes("eprints") || host.includes("repository"))
      return "Repository";
    return "PDF";
  }

  function codeRepoLabel(url) {
    try {
      const h = new URL(String(url).trim()).hostname.toLowerCase();
      if (h.includes("github.com")) return "GitHub";
      if (h.includes("gitlab.com")) return "GitLab";
      if (h.includes("bitbucket.org")) return "Bitbucket";
    } catch {}
    return "Code";
  }

  function modelRepoLabel(url) {
    try {
      const h = new URL(String(url).trim()).hostname.toLowerCase();
      if (h.includes("huggingface.co")) return "Hugging Face";
      if (h.includes("zenodo.org")) return "Zenodo";
      if (h.includes("github.com")) return "Model (GitHub)";
    } catch {}
    return "Model";
  }

  eleventyConfig.addFilter("isAbsoluteUrl", (h) =>
    /^https?:\/\//i.test(String(h || "").trim())
  );

  /** Empty string for relative/same-origin links; safe attrs to open external http(s) URLs in a new tab. */
  const siteOrigin = (() => {
    try {
      return new URL(site.url).origin;
    } catch {
      return "";
    }
  })();

  eleventyConfig.addFilter("externalLinkAttrs", (href) => {
    const s = String(href || "").trim();
    if (!s) return "";
    let u;
    try {
      if (/^https?:\/\//i.test(s)) {
        u = new URL(s);
      } else if (s.startsWith("//")) {
        u = new URL(`https:${s}`);
      } else {
        return "";
      }
    } catch {
      return "";
    }
    if (siteOrigin && u.origin === siteOrigin) return "";
    return ' target="_blank" rel="noopener noreferrer"';
  });

  eleventyConfig.addFilter("pubPrimaryLink", (pub) => {
    if (!pub) return "";
    const pdfs = pub.bibLinks && pub.bibLinks.pdf;
    if (pdfs && pdfs.length && pdfs[0]) return pdfs[0];
    if (pub.URL) return pub.URL;
    if (pub.DOI) {
      const d = String(pub.DOI)
        .replace(/^\s*https?:\/\/doi\.org\//i, "")
        .trim();
      return `https://doi.org/${d}`;
    }
    return "";
  });

  eleventyConfig.addFilter("bibLinkLabel", (url, kind, index, total) => {
    const k = String(kind || "").toLowerCase();
    const t = Number(total);
    const i = Number(index);
    const suffix = t > 1 && i >= 1 ? ` (${i})` : "";
    if (k === "pdf") return pdfArchiveLabel(url) + suffix;
    if (k === "slides") return "Slides" + suffix;
    if (k === "poster") return "Poster" + suffix;
    if (k === "code") return codeRepoLabel(url) + suffix;
    if (k === "model") return modelRepoLabel(url) + suffix;
    return "Link" + suffix;
  });

  eleventyConfig.addFilter("projectUrl", (projectId) => {
    if (!projectId) return "";
    return `/projects/#${encodeURIComponent(projectId)}`;
  });

  eleventyConfig.addNunjucksGlobal("projectLabel", (projects, pid) => {
    if (!projects || !pid) return pid || "";
    const p = projects.find((x) => x.id === pid);
    return p ? p.title : pid;
  });

  eleventyConfig.addPairedShortcode("widgetSlot", (content) => {
    const json = String(content || "").trim();
    return `<figure class="widget-figure"><div class="widget-slot" data-widget-autoinit><script type="application/json">${json}</script></div></figure>`;
  });

  eleventyConfig.on("eleventy.after", ({ dir }) => {
    fs.writeFileSync(path.join(dir.output, ".nojekyll"), "");
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
