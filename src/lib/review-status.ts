export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export function getReviewStatus(status: unknown): ReviewStatus {
  if (status === 'approved' || status === 'rejected') {
    return status;
  }

  return 'pending';
}

export function isPendingReview(review: { status?: unknown } | null | undefined): boolean {
  return getReviewStatus(review?.status) === 'pending';
}

export function isApprovedReview(review: { status?: unknown } | null | undefined): boolean {
  return getReviewStatus(review?.status) === 'approved';
}
