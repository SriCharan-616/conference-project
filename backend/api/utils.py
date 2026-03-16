import os
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import uuid
from io import BytesIO

try:
    from supabase import create_client, Client
except ImportError:
    Client = None


# -------------------------------------------------------
# SUPABASE FILE UPLOAD
# -------------------------------------------------------

def get_supabase_client():
    """Initialize Supabase client."""
    if not Client:
        raise ImportError("Supabase SDK not installed. Run: pip install supabase")
    
    url = settings.SUPABASE_URL
    key = settings.SUPABASE_KEY
    
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables")
    
    return create_client(url, key)


def upload_paper_to_supabase(file, filename=None):
    """
    Upload a paper PDF to Supabase Storage and return the public URL.
    
    Args:
        file: InMemoryUploadedFile object
        filename: Optional custom filename
    
    Returns:
        str: Public URL of the uploaded file
    
    Raises:
        ValueError: If file is not PDF or exceeds size limit
    """
    # Validate file type
    if not file.name.lower().endswith('.pdf'):
        raise ValueError("Only PDF files are allowed")
    
    # Validate file size (max 10MB)
    if file.size > 10 * 1024 * 1024:
        raise ValueError("File size exceeds maximum allowed size of 10MB")
    
    try:
        supabase = get_supabase_client()
        bucket_name = settings.SUPABASE_STORAGE_BUCKET
        
        # Generate unique filename
        if not filename:
            file_extension = file.name.split('.')[-1]
            filename = f"papers/{uuid.uuid4()}.{file_extension}"
        else:
            filename = f"papers/{filename}"
        
        # Read file content
        file_content = file.read()
        
        # Upload to Supabase
        response = supabase.storage.from_(bucket_name).upload(
            path=filename,
            file=file_content,
            file_options={"content-type": "application/pdf"}
        )
        
        # Generate public URL
        public_url = supabase.storage.from_(bucket_name).get_public_url(filename)
        
        return public_url
    
    except Exception as e:
        raise ValueError(f"Failed to upload file to Supabase: {str(e)}")


# -------------------------------------------------------
# EMAIL NOTIFICATIONS
# -------------------------------------------------------

def send_registration_confirmation_email(user, conference):
    """Send registration confirmation email."""
    subject = f"Registration Confirmed - {conference.title}"
    context = {
        'user_name': user.get_full_name() or user.username,
        'conference_title': conference.title,
        'conference_start': conference.start_date,
        'conference_location': conference.location,
    }
    
    html_message = f"""
    <h2>Registration Confirmed!</h2>
    <p>Hi {context['user_name']},</p>
    <p>You have successfully registered for <strong>{context['conference_title']}</strong></p>
    <p><strong>Conference Details:</strong></p>
    <ul>
        <li>Start Date: {context['conference_start']}</li>
        <li>Location: {context['conference_location']}</li>
    </ul>
    <p>Thank you for registering!</p>
    """
    
    send_mail(
        subject=subject,
        message=strip_tags(html_message),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_paper_submission_email(user, paper, conference):
    """Send paper submission confirmation email."""
    subject = f"Paper Submission Received - {conference.title}"
    context = {
        'user_name': user.get_full_name() or user.username,
        'paper_title': paper.title,
        'conference_title': conference.title,
    }
    
    html_message = f"""
    <h2>Paper Submission Received!</h2>
    <p>Hi {context['user_name']},</p>
    <p>Your paper <strong>"{context['paper_title']}"</strong> has been successfully submitted to {context['conference_title']}.</p>
    <p>You will receive updates about your submission status via email.</p>
    <p>Thank you for contributing!</p>
    """
    
    send_mail(
        subject=subject,
        message=strip_tags(html_message),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_paper_status_email(user, paper, status, conference):
    """Send paper status update email (accepted/rejected)."""
    status_display = "ACCEPTED" if status == "accepted" else "REJECTED"
    subject = f"Paper {status_display} - {conference.title}"
    
    html_message = f"""
    <h2>Paper Review Decision</h2>
    <p>Hi {user.get_full_name() or user.username},</p>
    <p>Your paper <strong>"{paper.title}"</strong> has been <strong>{status_display}</strong> for {conference.title}.</p>
    <p>Thank you for your submission!</p>
    """
    
    send_mail(
        subject=subject,
        message=strip_tags(html_message),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_payment_confirmation_email(user, registration, payment):
    """Send payment confirmation email."""
    subject = f"Payment Confirmed - {registration.conference.title}"
    
    html_message = f"""
    <h2>Payment Received!</h2>
    <p>Hi {user.get_full_name() or user.username},</p>
    <p>Your payment for <strong>{registration.conference.title}</strong> has been received.</p>
    <p><strong>Payment Details:</strong></p>
    <ul>
        <li>Amount: ₹{payment.amount}</li>
        <li>Transaction ID: {payment.transaction_id}</li>
        <li>Method: {payment.get_method_display()}</li>
    </ul>
    <p>Your registration is now confirmed!</p>
    """
    
    send_mail(
        subject=subject,
        message=strip_tags(html_message),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )
