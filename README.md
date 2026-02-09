# Pluto Theme — Frappe / ERPNext v16 Custom Styling App

A custom Frappe application that provides a complete, modular CSS theming layer for Frappe Framework and ERPNext v16. Edit the design tokens once and the entire UI updates.

## Quick Start

```bash
# From your bench directory:
bench get-app /path/to/pluto-frappe-template
bench --site your-site.local install-app pluto_theme
bench build --app pluto_theme
bench restart
```

## Project Structure

```
pluto_theme/
├── hooks.py                         # Frappe hooks — registers CSS/JS
├── modules.txt
├── patches.txt
├── __init__.py
├── config/
│   └── desktop.py                   # Module card on the desk
├── pluto_theme/                     # Frappe module directory
├── public/
│   ├── css/
│   │   ├── pluto_theme.bundle.css   # Main entry — imports everything
│   │   ├── variables.css            # Design tokens (colours, fonts, spacing)
│   │   ├── layout/
│   │   │   ├── navbar.css           # Top navigation bar
│   │   │   ├── sidebar.css          # Left & right sidebars
│   │   │   └── footer.css           # Footer
│   │   ├── components/
│   │   │   ├── buttons.css          # Buttons (primary, default, danger, etc.)
│   │   │   ├── cards.css            # Cards, widgets, dashboard panels
│   │   │   ├── forms.css            # Form inputs, labels, sections
│   │   │   ├── modals.css           # Modal dialogs
│   │   │   ├── lists.css            # List view, report builder
│   │   │   ├── indicators.css       # Status pills, badges, tags
│   │   │   └── dropdowns.css        # Dropdown menus
│   │   ├── pages/
│   │   │   ├── login.css            # Login & signup pages
│   │   │   ├── desk.css             # Desk / workspace
│   │   │   └── print.css            # Print formats & @media print
│   │   └── utilities/
│   │       ├── typography.css        # Fonts, headings, links, code
│   │       └── spacing.css           # Scrollbars, focus rings, transitions
│   ├── js/
│   │   └── pluto_theme.bundle.js    # Runtime JS customisations
│   ├── fonts/                        # Drop custom .woff2 / .ttf here
│   └── images/                       # Logos, favicons, illustrations
├── templates/
│   └── includes/                     # Jinja template overrides
└── www/                              # Custom web pages
```

## How to Customise

### 1. Change brand colours

Open **`public/css/variables.css`** and edit the `:root` custom properties:

```css
:root {
    --pluto-primary:       #6C5CE7;   /* ← your brand colour */
    --pluto-primary-light: #A29BFE;
    --pluto-primary-dark:  #4A3FCF;
    --pluto-primary-bg:    #F0EEFF;   /* light tint for hover states */
}
```

Every component file references these tokens, so a single change here propagates to buttons, links, indicators, sidebar highlights, and more.

### 2. Change fonts

In the same **`variables.css`**:

```css
--pluto-font-family:      "Your Font", -apple-system, sans-serif;
--pluto-font-family-mono: "Your Mono Font", monospace;
```

Drop your `.woff2` files into `public/fonts/` and add `@font-face` declarations at the top of `variables.css`.

### 3. Tweak a specific component

Each component has its own file. For example, to change how buttons look, edit **`public/css/components/buttons.css`**. The files are well-commented and use the design tokens from `variables.css`.

### 4. Enable dark mode

In **`public/js/pluto_theme.bundle.js`**, set:

```js
const CONFIG = {
    enableDarkModeToggle: true,
    // ...
};
```

Dark mode colours are defined at the bottom of `variables.css` under the `[data-theme="dark"]` selector.

### 5. Runtime JS customisations

The JS bundle at **`public/js/pluto_theme.bundle.js`** has a `CONFIG` object for common tweaks:

| Option | Default | Description |
|---|---|---|
| `enableDarkModeToggle` | `false` | Adds a dark/light toggle to the navbar |
| `sidebarCollapsedByDefault` | `false` | Collapses the sidebar on page load |
| `customBrandText` | `null` | Replaces the navbar brand text |
| `customBrandLogo` | `null` | Replaces the navbar logo image URL |
| `hidePoweredBy` | `false` | Hides the "Powered by Frappe" footer |
| `bodyClass` | `"pluto-theme"` | CSS class added to `<body>` for scoping |

### 6. Doctype-specific styles

Add a class to a specific form and then target it in CSS:

```js
// In pluto_theme.bundle.js
frappe.ui.form.on("Sales Order", {
    refresh: function (frm) {
        frm.page.wrapper.addClass("pluto-sales-order");
    }
});
```

```css
/* In a component CSS file */
.pluto-sales-order .form-layout {
    border-left: 4px solid var(--pluto-primary);
}
```

## Design Token Reference

| Token | Default | Purpose |
|---|---|---|
| `--pluto-primary` | `#6C5CE7` | Primary brand colour |
| `--pluto-secondary` | `#00CEC9` | Secondary accent |
| `--pluto-accent` | `#FD79A8` | Highlight / call-to-action |
| `--pluto-success` | `#00B894` | Success states |
| `--pluto-warning` | `#FDCB6E` | Warning states |
| `--pluto-danger` | `#D63031` | Error / destructive states |
| `--pluto-info` | `#0984E3` | Informational states |
| `--pluto-radius` | `0.5rem` | Default border radius |
| `--pluto-shadow` | `...` | Default box shadow |
| `--pluto-font-family` | System stack | Base font family |
| `--pluto-font-size-base` | `0.8125rem` | Base font size (13px) |
| `--pluto-navbar-height` | `50px` | Navbar height |
| `--pluto-sidebar-width` | `240px` | Sidebar width |

See `variables.css` for the full list including the neutral palette, spacing scale, z-index layers, and transitions.

## Development

```bash
# Watch for changes and rebuild on save
bench watch

# Build only this app
bench build --app pluto_theme

# Clear cache after CSS changes
bench clear-cache && bench restart
```

## License

MIT
