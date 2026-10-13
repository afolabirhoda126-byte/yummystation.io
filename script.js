/* ============ SETTINGS YOU CAN EDIT ============ */
const PHONE = "2348134761145";   // WhatsApp number: country code, no + or spaces
const DELIVERY = {                 // the delivery message shown on product cards and sent with orders
  next: "Next-day delivery",
  same: "Same-day delivery if ordered before 3pm, otherwise next day"
};
/* ================================================ */

const naira = n => "₦" + n.toLocaleString();
const wa = text => "https://wa.me/" + PHONE + (text ? "?text=" + encodeURIComponent(text) : "");

// footer / general WhatsApp links
document.querySelectorAll("a[data-wa]").forEach(a => a.href = wa());

// delivery chips
document.querySelectorAll(".chip").forEach(c => {
  const key = c.dataset.d || c.closest(".prod")?.dataset.d;
  c.textContent = DELIVERY[key] || "";
});

// price labels next to each option. A price of 0 means "not set yet" and shows nothing
document.querySelectorAll(".p").forEach(s => {
  if (s.dataset.price !== undefined) { const p = +s.dataset.price; s.textContent = p ? naira(p) : "₦ 10,000"; return; }
  const p = +s.parentElement.querySelector("input").dataset.price;
  s.textContent = p ? "- " + naira(p) : "";
});

// combo button
document.querySelectorAll("a.order[data-msg]").forEach(a => a.href = wa(a.dataset.msg));

// product order forms
document.querySelectorAll(".prod").forEach(card => {
  const f = card.querySelector("form.builder"); if (!f) return;
  const img = card.querySelector(".pimg img");
  const update = swap => {
    const parts = []; let price = 0;
    f.querySelectorAll("fieldset").forEach(fs => {
      const r = fs.querySelector("input[type=radio]:checked");
      if (r) { parts.push(r.value); price += +r.dataset.price; if (swap && r.dataset.img) img.src = r.dataset.img; }
      const s = fs.querySelector("input[type=range]");
      if (s) { const l = s.dataset.labels.split(",")[s.value - 1]; fs.querySelector(".out").textContent = l; parts.push(s.name + ": " + l); }
    });
    const note = f.querySelector("[name=note]").value.trim();
    if (note) parts.push("Note: " + note);
    const d = DELIVERY[card.dataset.d];
    f.querySelector(".summary").textContent = parts.join(" | ") + (price ? " | From " + naira(price) : " | Price confirmed on WhatsApp");
    f.querySelector(".order").href = wa("Hi, I'd like to order " + card.dataset.product + ": " + parts.join(", ") + ". (" + d + ")");
  };
  f.addEventListener("input", e => update(e.target.type === "radio"));
  update(false);
});
