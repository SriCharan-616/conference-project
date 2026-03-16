from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Conference, Session, Paper, Registration, Payment


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom User Admin."""
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {
            'fields': ('role', 'status', 'phone', 'created_at')
        }),
    )
    list_display = ('username', 'email', 'get_full_name', 'role', 'status', 'is_active')
    list_filter = ('role', 'status', 'is_active', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone')
    readonly_fields = ('created_at',)


@admin.register(Conference)
class ConferenceAdmin(admin.ModelAdmin):
    """Conference Admin."""
    
    list_display = ('title', 'start_date', 'end_date', 'organiser', 'status', 'created_at')
    list_filter = ('status', 'start_date', 'organiser')
    search_fields = ('title', 'theme', 'location')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'theme', 'location')
        }),
        ('Dates', {
            'fields': ('start_date', 'end_date', 'submission_deadline')
        }),
        ('Management', {
            'fields': ('organiser', 'status')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    """Session Admin."""
    
    list_display = ('title', 'conference', 'date', 'time_slot', 'session_type')
    list_filter = ('session_type', 'date', 'conference')
    search_fields = ('title', 'location')
    filter_horizontal = ('panel_members',)
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Session Information', {
            'fields': ('title', 'conference', 'session_type')
        }),
        ('Schedule', {
            'fields': ('date', 'time_slot')
        }),
        ('Details', {
            'fields': ('location', 'panel_members')
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(Paper)
class PaperAdmin(admin.ModelAdmin):
    """Paper Admin."""
    
    list_display = ('title', 'author', 'conference', 'status', 'submission_date')
    list_filter = ('status', 'submission_date', 'conference')
    search_fields = ('title', 'abstract', 'author__username', 'author__email')
    readonly_fields = ('submission_date', 'updated_at', 'author')
    
    fieldsets = (
        ('Paper Information', {
            'fields': ('title', 'abstract', 'conference')
        }),
        ('Submission', {
            'fields': ('author', 'submission_date', 'updated_at')
        }),
        ('Content', {
            'fields': ('file_url',)
        }),
        ('Review', {
            'fields': ('status',)
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        """Make author field read-only for existing papers."""
        if obj:  # editing an existing object
            return self.readonly_fields
        return super().get_readonly_fields(request, obj)


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    """Registration Admin."""
    
    list_display = ('user', 'conference', 'registration_date', 'payment_status', 'amount_paid')
    list_filter = ('payment_status', 'registration_date', 'conference')
    search_fields = ('user__username', 'user__email', 'conference__title')
    readonly_fields = ('registration_date', 'user')
    
    fieldsets = (
        ('Registration Details', {
            'fields': ('user', 'conference', 'registration_date')
        }),
        ('Payment', {
            'fields': ('payment_status', 'amount_paid')
        }),
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Payment Admin."""
    
    list_display = ('transaction_id', 'registration', 'amount', 'method', 'status', 'payment_date')
    list_filter = ('status', 'method', 'payment_date')
    search_fields = ('transaction_id', 'registration__user__email')
    readonly_fields = ('payment_date', 'transaction_id')
    
    fieldsets = (
        ('Payment Information', {
            'fields': ('registration', 'amount', 'method')
        }),
        ('Transaction', {
            'fields': ('transaction_id', 'status', 'payment_date')
        }),
    )
