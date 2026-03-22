---
title: "Welcome to the blog"
date: 2025-03-22
description: &desc "How this section is set up: Markdown, math, code highlighting, and the widget shortcode pattern."
summary: *desc
---

This post is a **smoke test** for the blog pipeline. Replace or delete it when you publish real articles.

## Code

```python
def layout_iou(box_a, box_b):
    """Toy example for syntax highlighting."""
    return 0.42
```

## Math

Inline: $e^{i\pi} + 1 = 0$. Display:

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

## Widget shortcode

The paired `widgetSlot` shortcode injects JSON for client-side init. The sample script reads `kind: "demo"` and renders a simple message (swap in Vega-Lite, Chart.js, etc. later).

{% widgetSlot %}
{"kind":"demo","message":"This line came from blog-widgets.js using the JSON above."}
{% endwidgetSlot %}

You can also use raw HTML in Markdown (enabled in the Markdown-it config) for one-off embeds, e.g. iframes.
