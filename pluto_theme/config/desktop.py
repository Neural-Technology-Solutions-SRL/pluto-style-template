from frappe import _


def get_data():
    return [
        {
            "module_name": "Pluto Theme",
            "type": "module",
            "label": _("Pluto Theme"),
            "color": "#0000ff",
            "icon": "octicon octicon-paintbrush",
            "description": "Custom theme and styling for Frappe / ERPNext.",
        }
    ]
