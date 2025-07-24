#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # 🛠️ Needed before setup()

    try:
        import django
        django.setup()  # ✅ this loads settings correctly

        from megamall.models import Product, Category
        from django.db import OperationalError

        if not Product.objects.exists():
            print("🔧 First-time setup: Running migrations and creating default data...")
            category, _ = Category.objects.get_or_create(name="Default")
            Product.objects.create(
                name="Test Product",
                price=100,
                category=category
            )
    except Exception as e:
        print(f"⚠️  Skipping dummy data setup: {e}")

    main()
