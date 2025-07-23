from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import Category, Product, GuestUser, HireItem


@admin.register(GuestUser)
class GuestUserAdmin(UserAdmin):
    model = GuestUser
    ordering = ['email']
    list_display = ['email', 'first_name', 'last_name', 'phone', 'is_staff', 'is_active']
    list_filter = ['is_staff', 'is_active', 'subscribed']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'phone')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'created_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'phone', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )

    search_fields = ['email', 'first_name', 'last_name', 'phone']


admin.site.register(Category)
admin.site.register(Product)
admin.site.register(HireItem)
