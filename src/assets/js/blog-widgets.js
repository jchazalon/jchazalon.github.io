/**
 * Hydrates `.widget-slot` regions emitted by the `widgetSlot` paired shortcode.
 * Extend `applySpec` with new `kind` values (e.g. Vega-Lite, Chart.js).
 */
function applySpec(container, spec) {
  if (!spec || typeof spec !== "object") return;
  if (spec.kind === "demo") {
    const p = document.createElement("p");
    p.className = "widget-demo";
    p.textContent = spec.message || "(empty demo message)";
    container.replaceChildren(p);
  }
}

function initSlot(el) {
  const script = el.querySelector("script[type='application/json']");
  if (!script) return;
  try {
    const spec = JSON.parse(script.textContent);
    applySpec(el, spec);
  } catch (e) {
    console.error("blog-widgets: invalid JSON in widget slot", e);
  }
}

document.querySelectorAll(".widget-slot[data-widget-autoinit]").forEach(initSlot);
