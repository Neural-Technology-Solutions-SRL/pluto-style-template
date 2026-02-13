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
	// Custom Module Icons — Neural-branded SVG replacements
	// ------------------------------------------------------------------
	// Each entry maps a Frappe symbol ID to custom SVG inner content.
	// All icons: 16×16 viewBox, stroke-based, using var(--icon-stroke).
	const STROKE_ATTRS = 'stroke="var(--icon-stroke)" fill="none" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"';

	const CUSTOM_ICONS = {
		// Accounting — minimal open ledger book
		"icon-accounting": `<path d="M2 2.5h4.5a1.5 1.5 0 0 1 1.5 1.5v9.5a1 1 0 0 0-1-1H2z" ${STROKE_ATTRS}/>
			<path d="M14 2.5H9.5A1.5 1.5 0 0 0 8 4v9.5a1 1 0 0 1 1-1H14z" ${STROKE_ATTRS}/>`,

		// Selling — upward trend arrow with base line
		"icon-selling": `<polyline points="2 12 6 7 9 9.5 14 3" ${STROKE_ATTRS}/>
			<polyline points="10.5 3 14 3 14 6.5" ${STROKE_ATTRS}/>
			<line x1="2" y1="14" x2="14" y2="14" ${STROKE_ATTRS}/>`,

		// Buying — shopping bag
		"icon-buying": `<path d="M3.5 5h9l-.8 7.5a1 1 0 0 1-1 .9H5.3a1 1 0 0 1-1-.9z" ${STROKE_ATTRS}/>
			<path d="M5.5 5V4a2.5 2.5 0 0 1 5 0v1" ${STROKE_ATTRS}/>`,

		// Stock — stacked boxes
		"icon-stock": `<rect x="2" y="8.5" width="5.5" height="5" rx="0.5" ${STROKE_ATTRS}/>
			<rect x="8.5" y="8.5" width="5.5" height="5" rx="0.5" ${STROKE_ATTRS}/>
			<rect x="5" y="2.5" width="6" height="5" rx="0.5" ${STROKE_ATTRS}/>`,

		// HR — person silhouette with circle head
		"icon-hr-module": `<circle cx="8" cy="4.5" r="2.5" ${STROKE_ATTRS}/>
			<path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" ${STROKE_ATTRS}/>`,

		// Manufacturing — gear/cog
		"icon-manufacturing": `<circle cx="8" cy="8" r="2" ${STROKE_ATTRS}/>
			<path d="M8 1.5v1.3M8 13.2v1.3M1.5 8h1.3M13.2 8h1.3M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9" ${STROKE_ATTRS}/>
			<circle cx="8" cy="8" r="4.5" ${STROKE_ATTRS}/>`,

		// Projects — kanban board (three columns with cards)
		"icon-projects": `<rect x="2" y="2" width="3.2" height="12" rx="0.5" ${STROKE_ATTRS}/>
			<rect x="6.4" y="2" width="3.2" height="8" rx="0.5" ${STROKE_ATTRS}/>
			<rect x="10.8" y="2" width="3.2" height="5.5" rx="0.5" ${STROKE_ATTRS}/>`,

		// CRM — two people connected (relationship)
		"icon-crm": `<circle cx="5" cy="5" r="2" ${STROKE_ATTRS}/>
			<circle cx="11" cy="5" r="2" ${STROKE_ATTRS}/>
			<path d="M1.5 13.5c0-2 1.6-3.5 3.5-3.5c.8 0 1.5.3 2.1.7" ${STROKE_ATTRS}/>
			<path d="M14.5 13.5c0-2-1.6-3.5-3.5-3.5c-.8 0-1.5.3-2.1.7" ${STROKE_ATTRS}/>`,

		// Assets — building
		"icon-assets": `<rect x="3" y="3" width="10" height="11" rx="0.5" ${STROKE_ATTRS}/>
			<line x1="3" y1="6" x2="13" y2="6" ${STROKE_ATTRS}/>
			<line x1="6" y1="9" x2="6" y2="14" ${STROKE_ATTRS}/>
			<line x1="10" y1="9" x2="10" y2="14" ${STROKE_ATTRS}/>
			<line x1="8" y1="9" x2="8" y2="14" ${STROKE_ATTRS}/>`,

		// Support — headset
		"icon-support": `<path d="M3 9V7a5 5 0 0 1 10 0v2" ${STROKE_ATTRS}/>
			<rect x="1.5" y="9" width="2.5" height="3.5" rx="0.5" ${STROKE_ATTRS}/>
			<rect x="12" y="9" width="2.5" height="3.5" rx="0.5" ${STROKE_ATTRS}/>
			<path d="M12 12.5c0 1.4-1.8 2.5-4 2.5" ${STROKE_ATTRS}/>`,

		// Quality — shield with checkmark
		"icon-quality-module": `<path d="M8 1.5L2.5 4v4c0 3.5 2.3 6 5.5 7c3.2-1 5.5-3.5 5.5-7V4z" ${STROKE_ATTRS}/>
			<polyline points="5.5 8 7.2 10 10.5 6.5" ${STROKE_ATTRS}/>`,

		// Setup — three horizontal sliders
		"icon-setup": `<line x1="2" y1="4" x2="14" y2="4" ${STROKE_ATTRS}/>
			<line x1="2" y1="8" x2="14" y2="8" ${STROKE_ATTRS}/>
			<line x1="2" y1="12" x2="14" y2="12" ${STROKE_ATTRS}/>
			<circle cx="5" cy="4" r="1.2" fill="var(--icon-stroke)" stroke="var(--icon-stroke)" stroke-width="0"/>
			<circle cx="10" cy="8" r="1.2" fill="var(--icon-stroke)" stroke="var(--icon-stroke)" stroke-width="0"/>
			<circle cx="7" cy="12" r="1.2" fill="var(--icon-stroke)" stroke="var(--icon-stroke)" stroke-width="0"/>`,

		// Education — graduation cap
		"icon-education": `<polygon points="8 2 1.5 6 8 10 14.5 6" ${STROKE_ATTRS}/>
			<path d="M4 7.5v4c0 1 1.8 2 4 2s4-1 4-2v-4" ${STROKE_ATTRS}/>
			<line x1="14.5" y1="6" x2="14.5" y2="11" ${STROKE_ATTRS}/>`,

		// Healthcare — heart with pulse line
		"icon-healthcare": `<path d="M8 13.5l-5-5.2A3.2 3.2 0 0 1 3 4a3 3 0 0 1 5 0a3 3 0 0 1 5 0a3.2 3.2 0 0 1 0 4.3z" ${STROKE_ATTRS}/>
			<polyline points="5 8 6.5 8 7.5 6 8.5 10 9.5 8 11 8" ${STROKE_ATTRS}/>`,

		// Retail — storefront
		"icon-retail": `<rect x="2" y="6.5" width="12" height="7.5" rx="0.5" ${STROKE_ATTRS}/>
			<polygon points="2 6.5 4 2.5 12 2.5 14 6.5" ${STROKE_ATTRS}/>
			<path d="M6.5 14v-3.5a1.5 1.5 0 0 1 3 0V14" ${STROKE_ATTRS}/>
			<line x1="5" y1="6.5" x2="5" y2="2.5" ${STROKE_ATTRS}/>
			<line x1="8" y1="6.5" x2="8" y2="2.5" ${STROKE_ATTRS}/>
			<line x1="11" y1="6.5" x2="11" y2="2.5" ${STROKE_ATTRS}/>`,

		// Non Profit — helping hand with heart
		"icon-non-profit": `<path d="M2 9.5c0-1 .8-1.5 1.5-1.5S5 9 5 9l1.5 1.5" ${STROKE_ATTRS}/>
			<path d="M5 10.5L2 13" ${STROKE_ATTRS}/>
			<path d="M6.5 10.5l4-3c.6-.5 1.5-.4 1.8.3s0 1.5-.6 2l-2.2 1.7" ${STROKE_ATTRS}/>
			<path d="M10 3.5a1.5 1.5 0 0 1 2.4-1.2a1.5 1.5 0 0 1 2.4 1.2c0 1.5-2.4 3-2.4 3S10 5 10 3.5z" ${STROKE_ATTRS}/>`,

		// Agriculture — leaf/plant sprouting
		"icon-agriculture": `<path d="M8 14V8" ${STROKE_ATTRS}/>
			<path d="M8 8c0-3 2.5-5.5 5.5-5.5C13.5 5.5 11 8 8 8z" ${STROKE_ATTRS}/>
			<path d="M8 11c0-2-1.8-3.5-4-3.5C4 9.5 5.8 11 8 11z" ${STROKE_ATTRS}/>`,
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
