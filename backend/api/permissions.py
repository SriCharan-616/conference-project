from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Allow access only to admin users."""
    
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == "admin"
        )


class IsOrganiser(permissions.BasePermission):
    """Allow access only to organiser users."""
    
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == "organiser"
        )


class IsAuthor(permissions.BasePermission):
    """Allow access only to author users."""
    
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == "author"
        )


class IsAttendee(permissions.BasePermission):
    """Allow access only to attendee users."""
    
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == "attendee"
        )


class IsAdminOrReadOnly(permissions.BasePermission):
    """Allow admin to edit; others can only read."""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == "admin"
        )


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Allow owners to edit their own objects; others can only read."""
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user or request.user.role == "admin"


class IsOrganiserOrReadOnly(permissions.BasePermission):
    """Allow organisers to manage their own conferences; others can read."""
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.organiser == request.user or request.user.role == "admin"


class CanAccessUserData(permissions.BasePermission):
    """Allow users to access their own data; admins can access any."""
    
    def has_object_permission(self, request, view, obj):
        return obj == request.user or request.user.role == "admin"
