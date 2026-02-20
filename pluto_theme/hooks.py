app_name = "pluto_theme"
app_title = "Pluto Theme"
app_publisher = "Neural"
app_description = "Custom theme and styling overrides for Pluto v16"
app_email = "hello@neural.com"
app_license = "MIT"
app_version = "0.1.0"

# --------------------------------------------------------------------------
# Assets — included on every desk page
# --------------------------------------------------------------------------
# The .bundle.css / .bundle.js files in public/ are auto-bundled by the
# Pluto build system. We also register them explicitly so they load on
# all desk pages (including the login screen for the CSS).

app_include_css = [
    "/assets/pluto_theme/css/pluto_theme.bundle.css",
]

app_include_js = [
    "/assets/pluto_theme/js/pluto_theme.bundle.js",
]

# --------------------------------------------------------------------------
# Website / portal assets (guest-facing pages, login, etc.)
# --------------------------------------------------------------------------

web_include_css = [
    "/assets/pluto_theme/css/pluto_theme.bundle.css",
]

web_include_js = []

# --------------------------------------------------------------------------
# Hooks — uncomment and customise as needed
# --------------------------------------------------------------------------

# Override templates
# override_whitelisted_methods = {}
# override_doctype_class = {}

# Jinja environment customisation
# jinja = {
#     "methods": [],
#     "filters": [],
# }

website_context = {
    "splash_image": "/assets/pluto_theme/images/logo-neural.png",
}

# Home page (leave commented to keep Pluto default)
# home_page = "login"

# --------------------------------------------------------------------------
# Doc Events — uncomment to hook into document lifecycle
# --------------------------------------------------------------------------
# doc_events = {
#     "*": {
#         "on_update": "pluto_theme.overrides.on_update",
#     }
# }

# --------------------------------------------------------------------------
# Fixtures — export customisations so they travel with the app
# --------------------------------------------------------------------------
# fixtures = [
#     {"dt": "Website Settings"},
#     {"dt": "Custom Field", "filters": [["module", "=", "Pluto Theme"]]},
#     {"dt": "Property Setter", "filters": [["module", "=", "Pluto Theme"]]},
# ]

# --------------------------------------------------------------------------
# Build / bundling
# --------------------------------------------------------------------------
# required_apps = ["pluto"]  # Uncomment if you want an explicit dependency
