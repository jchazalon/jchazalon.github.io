module.exports = {
  layout: "post.njk",
  katex: true,
  ogType: "article",
  loadBlogWidgets: true,
  eleventyComputed: {
    permalink: (data) => `/blog/${data.page.fileSlug}/index.html`,
    tags(data) {
      const raw = data.tags;
      const extras = [];
      if (Array.isArray(raw)) {
        for (const t of raw) {
          if (t && t !== "posts") extras.push(t);
        }
      } else if (raw && raw !== "posts") {
        extras.push(raw);
      }
      return ["posts", ...extras];
    },
  },
};
