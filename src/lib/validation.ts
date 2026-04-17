/**
 * Input validation utilities for public-facing forms.
 * Prevents stored XSS, data integrity issues, and spam flooding.
 */

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 20;
const MAX_SUBJECT_LENGTH = 200;
const MAX_BODY_LENGTH = 1000;
const MAX_ROLE_LENGTH = 100;

// Simple email regex — not exhaustive, but catches most invalid input
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Strip HTML tags to prevent stored XSS
function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

// Trim and limit length
function sanitize(input: string, maxLength: number): string {
  return stripHtml(input.trim()).substring(0, maxLength);
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  body: string;
  honeypot: string;
  submittedAtMs: number;
}

export interface ReviewFormData {
  authorName: string;
  professionalRole: string;
  body: string;
  rating: number;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function validateContactForm(raw: {
  name: string | null;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string | null;
  honeypot: string | null;
  startedAtMs: number | null;
}): ValidationResult<ContactFormData> {
  const name = sanitize(raw.name || '', MAX_NAME_LENGTH);
  const email = sanitize(raw.email || '', MAX_EMAIL_LENGTH);
  const phone = sanitize(raw.phone || '', MAX_PHONE_LENGTH);
  const subject = sanitize(raw.subject || '', MAX_SUBJECT_LENGTH);
  const body = sanitize(raw.message || '', MAX_BODY_LENGTH);
  const honeypot = sanitize(raw.honeypot || '', MAX_NAME_LENGTH);
  const startedAtMs = Number(raw.startedAtMs || 0);
  const submissionAgeMs = Date.now() - startedAtMs;

  if (honeypot) {
    return { success: false, error: 'Spam protection triggered.' };
  }

  if (!Number.isFinite(startedAtMs) || startedAtMs <= 0 || submissionAgeMs < 2000) {
    return { success: false, error: 'Please take a moment before submitting.' };
  }

  if (!name || name.length < 2) {
    return { success: false, error: 'Name must be at least 2 characters.' };
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  if (!subject || subject.length < 3) {
    return { success: false, error: 'Subject must be at least 3 characters.' };
  }

  if (!body || body.length < 10) {
    return { success: false, error: 'Message must be at least 10 characters.' };
  }

  return {
    success: true,
    data: { name, email, phone, subject, body, honeypot: '', submittedAtMs: startedAtMs },
  };
}

export function validateReviewForm(raw: {
  name: string | null;
  role: string | null;
  feedback: string | null;
  rating: number;
}): ValidationResult<ReviewFormData> {
  const authorName = sanitize(raw.name || '', MAX_NAME_LENGTH);
  const professionalRole = sanitize(raw.role || '', MAX_ROLE_LENGTH);
  const body = sanitize(raw.feedback || '', MAX_BODY_LENGTH);
  const rating = raw.rating;

  if (!authorName || authorName.length < 2) {
    return { success: false, error: 'Name must be at least 2 characters.' };
  }

  if (!professionalRole || professionalRole.length < 2) {
    return { success: false, error: 'Professional role is required.' };
  }

  if (!body || body.length < 10) {
    return { success: false, error: 'Feedback must be at least 10 characters.' };
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { success: false, error: 'Rating must be between 1 and 5.' };
  }

  return {
    success: true,
    data: { authorName, professionalRole, body, rating },
  };
}
