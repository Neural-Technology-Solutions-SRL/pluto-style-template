/**
 * Pluto Theme — Runtime Customisations
 * =========================================================================
 * This JS bundle loads on every desk page. Use it for:
 *   - DOM manipulations that CSS alone cannot achieve
 *   - Frappe event hooks (after_load, on_page_change, etc.)
 *   - Dynamic class toggling (dark mode, sidebar collapse, etc.)
 *
 * The bundle is auto-included by Frappe's build system via the
 * `.bundle.js` naming convention + `app_include_js` in hooks.py.
 * =========================================================================
 */

(function () {
	"use strict";

	// ------------------------------------------------------------------
	// Config — easy knobs you can flip without touching the rest
	// ------------------------------------------------------------------
	const CONFIG = {
		// Set to true to add a "dark mode" toggle to the navbar
		enableDarkModeToggle: false,

		// Set to true to collapse the sidebar by default
		sidebarCollapsedByDefault: false,

		// Custom brand text shown in the navbar (set null to keep default)
		customBrandText: null,

		// Custom brand logo URL (set null to keep default)
		customBrandLogo: null,

		// Hide "Powered by Frappe" in the footer
		hidePoweredBy: false,

		// Add a CSS class to <body> so you can scope styles
		bodyClass: "pluto-theme",
	};

	// ------------------------------------------------------------------
	// Boot — runs once when the page is ready
	// ------------------------------------------------------------------
	function boot() {
		document.body.classList.add(CONFIG.bodyClass);

		if (CONFIG.customBrandText) {
			setBrandText(CONFIG.customBrandText);
		}

		if (CONFIG.customBrandLogo) {
			setBrandLogo(CONFIG.customBrandLogo);
		}

		if (CONFIG.hidePoweredBy) {
			hidePoweredByBadge();
		}

		if (CONFIG.enableDarkModeToggle) {
			injectDarkModeToggle();
		}

		if (CONFIG.sidebarCollapsedByDefault) {
			collapseSidebar();
		}
	}

	// ------------------------------------------------------------------
	// Brand helpers
	// ------------------------------------------------------------------
	function setBrandText(text) {
		const el = document.querySelector(".navbar-brand .app-logo, .navbar-brand");
		if (el) el.textContent = text;
	}

	function setBrandLogo(url) {
		const img = document.querySelector(".navbar-brand img");
		if (img) {
			img.src = url;
		}
	}

	function hidePoweredByBadge() {
		const el = document.querySelector(".footer-powered");
		if (el) el.style.display = "none";
	}

	// ------------------------------------------------------------------
	// Sidebar collapse
	// ------------------------------------------------------------------
	function collapseSidebar() {
		document.body.classList.add("pluto-sidebar-collapsed");
	}

	// ------------------------------------------------------------------
	// Dark mode toggle
	// ------------------------------------------------------------------
	function injectDarkModeToggle() {
		// Wait for the navbar to render
		const navbar = document.querySelector(".navbar-right, .navbar-nav:last-child");
		if (!navbar) return;

		const stored = localStorage.getItem("pluto_dark_mode");
		if (stored === "true") {
			document.documentElement.setAttribute("data-theme", "dark");
		}

		const toggle = document.createElement("li");
		toggle.className = "nav-item pluto-dark-toggle";
		toggle.innerHTML = `
			<a class="nav-link" href="#" title="Toggle dark mode"
			   style="font-size:16px; padding:8px 10px; cursor:pointer;">
				<span class="pluto-toggle-icon">${stored === "true" ? "\u2600\uFE0F" : "\uD83C\uDF19"}</span>
			</a>
		`;

		toggle.addEventListener("click", function (e) {
			e.preventDefault();
			const isDark =
				document.documentElement.getAttribute("data-theme") === "dark";
			if (isDark) {
				document.documentElement.removeAttribute("data-theme");
				localStorage.setItem("pluto_dark_mode", "false");
				toggle.querySelector(".pluto-toggle-icon").textContent = "\uD83C\uDF19";
			} else {
				document.documentElement.setAttribute("data-theme", "dark");
				localStorage.setItem("pluto_dark_mode", "true");
				toggle.querySelector(".pluto-toggle-icon").textContent = "\u2600\uFE0F";
			}
		});

		navbar.prepend(toggle);
	}

	// ------------------------------------------------------------------
	// Frappe event hooks
	// ------------------------------------------------------------------

	// After the desk page loads
	$(document).on("startup", function () {
		boot();
	});

	// Fallback if startup already fired
	if (frappe && frappe.boot) {
		boot();
	}

	// On every route change (SPA navigation)
	if (frappe && frappe.router && frappe.router.on) {
		frappe.router.on("change", function () {
			// Re-apply any DOM changes that may have been lost during
			// route transitions. Add custom per-page logic here.
		});
	}

	// ------------------------------------------------------------------
	// Utility: apply styles to specific doctypes
	// ------------------------------------------------------------------
	// Example usage (uncomment and modify):
	//
	// frappe.ui.form.on("Sales Order", {
	//     refresh: function (frm) {
	//         // Add a class to the form wrapper for doctype-specific CSS
	//         frm.page.wrapper.addClass("pluto-sales-order");
	//     }
	// });
})();
