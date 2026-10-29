// Meta Pixel events. The base code (init + PageView) lives in each page's <head>.
const track = (event, params) => {
  if (typeof window.fbq === "function") window.fbq("track", event, params);
};
const trackCustom = (event, params) => {
  if (typeof window.fbq === "function") window.fbq("trackCustom", event, params);
};
const SUBMITTED_KEY = "anything:contact-submitted";

document.addEventListener("DOMContentLoaded", () => {
  const page = location.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";

  // Content views on the key pages.
  if (page.endsWith("/about")) {
    track("ViewContent", { content_name: "About", content_category: "Page" });
  } else if (page.endsWith("/contact")) {
    track("ViewContent", { content_name: "Contact", content_category: "Page" });
  }

  // Conversion: only count Lead/Contact when the visitor actually submitted the
  // form, so direct visits or refreshes of /thank-you aren't counted.
  if (page.endsWith("/thank-you")) {
    let subject = null;
    try {
      subject = sessionStorage.getItem(SUBMITTED_KEY);
      sessionStorage.removeItem(SUBMITTED_KEY);
    } catch (error) {
      // Storage unavailable (e.g. strict privacy mode): fall back to referrer.
      if (document.referrer.includes("/contact")) subject = "";
    }
    if (subject !== null) {
      const params = { content_name: "Contact form" };
      if (subject) params.content_category = subject;
      track("Lead", params);
      track("Contact", params);
    }
  }

  // Clicks on any link that leads to the contact page (nav, CTAs, cards).
  document.querySelectorAll('a[href$="contact.html"], a[href$="/contact"]').forEach((link) => {
    link.addEventListener("click", () => {
      trackCustom("ContactCTAClick", {
        from_page: page,
        link_text: link.textContent.replace(/\s+/g, " ").replace(/[↗↘]/g, "").trim(),
      });
    });
  });

  // Keep footer years current.
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  // Accessible mobile navigation.
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation",
      );
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation");
      });
    });
  }

  // Contact form: submits natively to Netlify Forms, then lands on /thank-you.
  const form = document.querySelector("#contact-form");
  const feedback = document.querySelector("#form-feedback");
  if (form && feedback) {
    form.addEventListener("submit", (event) => {
      if (!form.reportValidity()) {
        event.preventDefault();
        return;
      }
      try {
        const subject = form.querySelector("#subject");
        sessionStorage.setItem(SUBMITTED_KEY, subject ? subject.value : "");
      } catch (error) {
        // Storage unavailable; the thank-you page falls back to the referrer.
      }
      const button = form.querySelector(".form-submit");
      if (button) {
        button.disabled = true;
        button.innerHTML = "Sending your message <span>…</span>";
      }
      feedback.textContent = "";
    });
    // Re-enable the button if the visitor comes back via the browser's back button.
    window.addEventListener("pageshow", (event) => {
      const button = form.querySelector(".form-submit");
      if (event.persisted && button) {
        button.disabled = false;
        button.innerHTML = "Send your message <span>↗</span>";
      }
    });
  }
});
