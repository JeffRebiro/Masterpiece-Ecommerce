from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from megamall.views import (
    create_superuser_view,
    ProductView,
    CategoryView,
    HireItemViewSet,
    GuestUserViewSet,
    ShippingAddressViewSet,
    CustomTokenObtainPairView,
    user_profile,
    create_order,
    get_order_status,
    invoice_pdf_view,
    initiate_payment,
    mpesa_callback,
    mpesa_access_token_view,
    create_courier_order,  # ✅ Function-based view, not a ViewSet
)

# DRF Router (only for ViewSets)
router = DefaultRouter()
router.register(r'products', ProductView, basename='product')
router.register(r'categories', CategoryView, basename='category')
router.register(r'guest-users', GuestUserViewSet, basename='guestuser')
router.register(r'hire-items', HireItemViewSet, basename='hireitem')
router.register(r'shipping-addresses', ShippingAddressViewSet, basename='shippingaddress')

# URL Patterns
urlpatterns = [
    # Redirect root to API base
    path('', RedirectView.as_view(url='/api/', permanent=False)),
    path("create-temp-admin/", create_superuser_view),

    # Admin Panel
    path('admin/', admin.site.urls),

    # API Base Routes from DRF router
    path('api/', include(router.urls)),

    # Authentication
    path('api/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User
    path('api/user-profile/', user_profile, name='user-profile'),

    # Orders
    path('api/orders/', create_order, name='create-order'),
    path('api/orders/<uuid:order_id>/', get_order_status, name='order-status'),
    path('api/orders/<uuid:order_id>/invoice/', invoice_pdf_view, name='invoice-pdf'),

    # M-Pesa
    path('api/mpesa/token/', mpesa_access_token_view, name='mpesa-token'),
    path('api/payment/mpesa/initiate/', initiate_payment, name='initiate-payment'),
    path('mpesa/callback/', mpesa_callback, name='mpesa-callback'),

    # Courier (✅ function-based endpoint)
    path('api/courier/', create_courier_order, name='create-courier-order'),
]

# Static/media handling for development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
