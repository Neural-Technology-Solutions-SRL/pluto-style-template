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
		customBrandLogo: "/assets/pluto_theme/images/logo-neural.png",

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

		replaceModuleIcons();
	}

	// ------------------------------------------------------------------
	// Custom Module Icons — Neural-branded filled SVG replacements
	// ------------------------------------------------------------------
	// Each entry maps a Frappe symbol ID to custom SVG inner content.
	// All icons: 16×16 viewBox, filled style, using var(--icon-stroke).
	// Designs based on the Neural brand icon set.
	const IC = "var(--icon-stroke)";

	const CUSTOM_ICONS = {
		// Accounting — Bank/temple with columns
		"icon-accounting":
			`<path d="M8 1L2 5h12L8 1z" fill="${IC}"/>` +
			`<rect x="2" y="5" width="12" height="1.2" fill="${IC}"/>` +
			`<rect x="3.2" y="6.8" width="1.6" height="5.2" fill="${IC}" rx="0.3"/>` +
			`<rect x="7.2" y="6.8" width="1.6" height="5.2" fill="${IC}" rx="0.3"/>` +
			`<rect x="11.2" y="6.8" width="1.6" height="5.2" fill="${IC}" rx="0.3"/>` +
			`<rect x="2" y="12.5" width="12" height="2" fill="${IC}" rx="0.4"/>`,

		// Assets — Office building with windows (evenodd cutouts)
		"icon-assets":
			`<path fill-rule="evenodd" d="M4.5 1h7a1 1 0 011 1v12.5h-9V2a1 1 0 011-1z` +
			`M5.8 3.5h1.6v1.6H5.8z M8.6 3.5h1.6v1.6H8.6z` +
			`M5.8 6.5h1.6v1.6H5.8z M8.6 6.5h1.6v1.6H8.6z` +
			`M7 10h2v4.5H7z" fill="${IC}"/>`,

		// Buying — Shopping cart with items
		"icon-buying":
			`<path d="M4.3 4h10.2l-1.8 5.5H5.5z" fill="${IC}"/>` +
			`<path d="M1 1h2.2l.8 2.5" fill="none" stroke="${IC}" stroke-width="1.4" stroke-linecap="round"/>` +
			`<path d="M4 6.5l1.3 4h7" fill="none" stroke="${IC}" stroke-width="1.4" stroke-linecap="round"/>` +
			`<circle cx="6" cy="13" r="1.3" fill="${IC}"/>` +
			`<circle cx="11.5" cy="13" r="1.3" fill="${IC}"/>`,

		// Stock — Stacked warehouse boxes
		"icon-stock":
			`<rect x="5" y="1.5" width="6" height="5" fill="${IC}" rx="0.5"/>` +
			`<line x1="8" y1="1.5" x2="8" y2="6.5" stroke="${IC}" stroke-width="0.6" opacity="0.3"/>` +
			`<rect x="1.5" y="8" width="6" height="5.5" fill="${IC}" rx="0.5"/>` +
			`<line x1="4.5" y1="8" x2="4.5" y2="13.5" stroke="${IC}" stroke-width="0.6" opacity="0.3"/>` +
			`<rect x="8.5" y="8" width="6" height="5.5" fill="${IC}" rx="0.5"/>` +
			`<line x1="11.5" y1="8" x2="11.5" y2="13.5" stroke="${IC}" stroke-width="0.6" opacity="0.3"/>`,

		// HR — Person silhouette
		"icon-hr-module":
			`<circle cx="8" cy="4" r="2.8" fill="${IC}"/>` +
			`<path d="M2.5 15a5.5 5.5 0 0111 0z" fill="${IC}"/>`,

		// Manufacturing — Gear with wrench
		"icon-manufacturing":
			`<path fill-rule="evenodd" d="M7.1 2.9 A5.2 5.2 0 0 1 6.9 2.9 L6.5 1.0 A7.2 7.2 0 0 1 9.5 1.0 L9.1 2.9 A5.2 5.2 0 0 1 10.8 3.6 L11.9 2.0 A7.2 7.2 0 0 1 14.0 4.1 L12.4 5.2 A5.2 5.2 0 0 1 13.1 6.9 L15.0 6.5 A7.2 7.2 0 0 1 15.0 9.5 L13.1 9.1 A5.2 5.2 0 0 1 12.4 10.8 L14.0 11.9 A7.2 7.2 0 0 1 11.9 14.0 L10.8 12.4 A5.2 5.2 0 0 1 9.1 13.1 L9.5 15.0 A7.2 7.2 0 0 1 6.5 15.0 L6.9 13.1 A5.2 5.2 0 0 1 5.2 12.4 L4.1 14.0 A7.2 7.2 0 0 1 2.0 11.9 L3.6 10.8 A5.2 5.2 0 0 1 2.9 9.1 L1.0 9.5 A7.2 7.2 0 0 1 1.0 6.5 L2.9 6.9 A5.2 5.2 0 0 1 3.6 5.2 L2.0 4.1 A7.2 7.2 0 0 1 4.1 2.0 L5.2 3.6 Z M8 6 A2 2 0 1 0 8 10 A2 2 0 1 0 8 6Z" fill="${IC}"/>`,

		// Projects — Kanban board columns
		"icon-projects":
			`<rect x="1.5" y="1.5" width="3.5" height="13" fill="${IC}" rx="0.8"/>` +
			`<rect x="6.2" y="1.5" width="3.5" height="8.5" fill="${IC}" rx="0.8"/>` +
			`<rect x="11" y="1.5" width="3.5" height="5.5" fill="${IC}" rx="0.8"/>`,

		// CRM — Two people / relationship
		"icon-crm":
			`<circle cx="5.5" cy="4.5" r="2.2" fill="${IC}"/>` +
			`<circle cx="10.5" cy="4.5" r="2.2" fill="${IC}"/>` +
			`<path d="M1 14a4.5 4.5 0 019 0z" fill="${IC}"/>` +
			`<path d="M6 14a4.5 4.5 0 019 0z" fill="${IC}"/>`,

		// Support — Headset
		"icon-support":
			`<path d="M3.5 8.5V7a4.5 4.5 0 019 0v1.5" fill="none" stroke="${IC}" stroke-width="1.8" stroke-linecap="round"/>` +
			`<rect x="1" y="8.5" width="3" height="4" fill="${IC}" rx="1"/>` +
			`<rect x="12" y="8.5" width="3" height="4" fill="${IC}" rx="1"/>` +
			`<path d="M12 12.5c0 1.5-1.8 2.5-4 2.5" fill="none" stroke="${IC}" stroke-width="1.2" stroke-linecap="round"/>`,

		// Quality — Magnifying glass with checkmark
		"icon-quality-module":
			`<path fill-rule="evenodd" d="M7 1a6 6 0 104.45 10.03l3.26 3.26a1 1 0 001.41-1.41l-3.26-3.26A6 6 0 007 1zM3 7a4 4 0 118 0 4 4 0 01-8 0z" fill="${IC}"/>` +
			`<polyline points="5 7 6.5 8.8 9.5 5.5" fill="none" stroke="${IC}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>`,

		// Setup — Gear / settings (matching reference "ERPNext Setting")
		"icon-setup":
			`<path fill-rule="evenodd" d="M7.0 3.8 A4.8 4.8 0 0 1 7.1 3.8 L6.8 2.1 A6.5 6.5 0 0 1 9.2 2.1 L8.9 3.8 A4.8 4.8 0 0 1 10.7 4.5 L11.6 3.1 A6.5 6.5 0 0 1 13.4 4.9 L12.0 5.8 A4.8 4.8 0 0 1 12.7 7.6 L14.4 7.3 A6.5 6.5 0 0 1 14.4 9.7 L12.7 9.4 A4.8 4.8 0 0 1 12.0 11.2 L13.4 12.1 A6.5 6.5 0 0 1 11.6 13.9 L10.7 12.5 A4.8 4.8 0 0 1 8.9 13.2 L9.2 14.9 A6.5 6.5 0 0 1 6.8 14.9 L7.1 13.2 A4.8 4.8 0 0 1 5.3 12.5 L4.4 13.9 A6.5 6.5 0 0 1 2.6 12.1 L4.0 11.2 A4.8 4.8 0 0 1 3.3 9.4 L1.6 9.7 A6.5 6.5 0 0 1 1.6 7.3 L3.3 7.6 A4.8 4.8 0 0 1 4.0 5.8 L2.6 4.9 A6.5 6.5 0 0 1 4.4 3.1 L5.3 4.5 Z M8 6.7 A1.8 1.8 0 1 0 8 10.3 A1.8 1.8 0 1 0 8 6.7Z" fill="${IC}"/>`,

		// Selling — Handshake (matching reference)
		"icon-selling":
			`<path d="M1 7h2.5l2.5 2 3-1.5L11 9l2.5-2H16" fill="none" stroke="${IC}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>` +
			`<path d="M5.5 9l-1 3.5 2.5-1 2 1.5 2-1.5 1.5 1-1-3.5" fill="none" stroke="${IC}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>` +
			`<path d="M1 4.5h3l1.5 2" fill="none" stroke="${IC}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>` +
			`<path d="M15 4.5h-3l-1.5 2" fill="none" stroke="${IC}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`,

		// Education — Graduation cap
		"icon-education":
			`<polygon points="8 2 1 6 8 10 15 6" fill="${IC}"/>` +
			`<path d="M4 7.5v4c0 1.2 1.8 2.2 4 2.2s4-1 4-2.2v-4" fill="${IC}"/>` +
			`<rect x="14" y="6" width="1.2" height="5" fill="${IC}" rx="0.3"/>` +
			`<circle cx="14.6" cy="11.5" r="0.8" fill="${IC}"/>`,

		// Healthcare — Heart with pulse line
		"icon-healthcare":
			`<path d="M8 14l-5.5-5.5A3.5 3.5 0 012.5 4 3.2 3.2 0 018 3a3.2 3.2 0 015.5 1 3.5 3.5 0 010 4.5z" fill="${IC}"/>` +
			`<polyline points="4.5 8 6 8 7 6 8.2 10.5 9.5 7.5 11.5 8" fill="none" stroke="${IC}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>`,

		// Retail — Storefront
		"icon-retail":
			`<path d="M2 7h12v7.5H2z" fill="${IC}"/>` +
			`<path d="M3.5 2h9L14 7H2z" fill="${IC}"/>` +
			`<path fill-rule="evenodd" d="M6.5 10h3v4.5h-3z" fill="${IC}" opacity="0.3"/>`,

		// Non Profit — Hand cradling heart
		"icon-non-profit":
			`<path d="M8.5 3a1.8 1.8 0 013 0 1.8 1.8 0 013 0c.5 1.8-1.5 3.8-3 5-1.5-1.2-3.5-3.2-3-5z" fill="${IC}"/>` +
			`<path d="M1.5 10c0-.8.6-1.5 1.5-1.5s1.5.7 2 1.2l1.5 1.3" fill="none" stroke="${IC}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>` +
			`<path d="M5 11.5L2.5 14" fill="none" stroke="${IC}" stroke-width="1.4" stroke-linecap="round"/>` +
			`<path d="M6.5 11l3.5-2c.5-.3 1.2-.1 1.4.4.2.5 0 1.1-.5 1.4L8 13" fill="none" stroke="${IC}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>`,

		// Agriculture — Filled leaf/plant
		"icon-agriculture":
			`<path d="M7.5 14V8.5" fill="none" stroke="${IC}" stroke-width="1.5" stroke-linecap="round"/>` +
			`<path d="M7.5 8.5c0-3.5 3-6 6-6C13.5 6 11 8.5 7.5 8.5z" fill="${IC}"/>` +
			`<path d="M7.5 11.5c0-2.5-2-4-4.5-4C3 10 5 11.5 7.5 11.5z" fill="${IC}"/>`,
	};

	/**
	 * Replace Frappe's default module icons with Neural custom SVG symbols.
	 * Finds `#frappe-symbols` and swaps matching `<symbol>` inner content.
	 * If the sprite sheet isn't in the DOM yet, retries via MutationObserver.
	 */
	function replaceModuleIcons() {
		const sprite = document.getElementById("frappe-symbols");
		if (sprite) {
			_injectIcons(sprite);
		} else {
			// Sprite sheet not yet loaded — watch for it
			const observer = new MutationObserver(function (mutations, obs) {
				const el = document.getElementById("frappe-symbols");
				if (el) {
					obs.disconnect();
					_injectIcons(el);
				}
			});
			observer.observe(document.documentElement, {
				childList: true,
				subtree: true,
			});
		}
	}

	function _injectIcons(spriteEl) {
		Object.keys(CUSTOM_ICONS).forEach(function (symbolId) {
			const existing = spriteEl.querySelector("#" + symbolId);
			if (existing) {
				existing.innerHTML = CUSTOM_ICONS[symbolId];
			} else {
				// Symbol doesn't exist yet — create it
				const symbol = document.createElementNS(
					"http://www.w3.org/2000/svg",
					"symbol"
				);
				symbol.setAttribute("id", symbolId);
				symbol.setAttribute("viewBox", "0 0 16 16");
				symbol.innerHTML = CUSTOM_ICONS[symbolId];
				spriteEl.appendChild(symbol);
			}
		});
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
			// Re-apply icons after SPA route transitions
			replaceModuleIcons();
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
