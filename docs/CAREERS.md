# Careers page (v1)

`/careers` lists open roles, `/careers/<slug>` is each role's own page (indexed by
Google for Jobs), and candidates apply without an account. Applications are saved
to MongoDB Atlas and emailed to HR through Resend.

## Go-live checklist

1. **Replace the sample roles** in `src/lib/careers/jobs.js` with real openings
   (titles, details, salaries, dates). Also check `REVIEW_PROMISE` (the timeline
   promised to candidates) and `CAREERS_EMAIL`.
2. **MongoDB Atlas**
   - Create a database user with read/write on the `gorevive` database.
   - Network Access: allow your server's IP. On Vercel, either allow
     `0.0.0.0/0` (with a strong password) or use the Vercel ↔ Atlas integration.
   - Set `MONGODB_URI` and `MONGODB_DB`. Indexes are created automatically on
     the first application.
3. **Resend**
   - Add and verify the domain `gorevive.in` (add the SPF/DKIM DNS records
     Resend shows). Emails won't send from an unverified domain.
   - Set `RESEND_API_KEY`, `CAREERS_FROM`, `CAREERS_INBOX`.
4. **Rate limit behind a proxy/CDN:** set `TRUSTED_IP_HEADER` (already used by
   the login limiter) so the 10-applications-per-10-minutes limit is per real IP.
5. Submit a test application with and without a resume and check both emails.

See `.env.example` for every variable.

## How it works

| Piece | File |
| --- | --- |
| Roles (edit here) | `src/lib/careers/jobs.js` |
| Field rules (form + API share them) | `src/lib/careers/validate.js` |
| List, filters, drawer | `src/app/careers/page.js`, `components/CareersBoard.jsx`, `components/JobDrawer.jsx` |
| Role page + JobPosting JSON-LD | `src/app/careers/[slug]/page.js` |
| Form (drafts saved locally, "Applied ✓") | `components/ApplyForm.jsx`, `src/lib/careers/careersStore.js` |
| API | `src/app/api/careers/apply/route.js` |
| MongoDB | `src/lib/server/mongo.js`, `src/lib/server/careers.js` |
| Emails | `src/lib/server/email.js` |

**Submission flow:** rate limit → honeypot check → role open? → consent →
validate fields → resume check (≤ 4 MB, real PDF/DOCX by file signature) →
duplicate check (one application per email per role) → save resume to GridFS
and the application to `job_applications` → email HR (resume attached,
reply-to = candidate) and the candidate → record email results on the
application (`notifications.hr`, `notifications.candidate`).

If email fails, the application is still saved and the failure is logged and
stored on the document, so nothing is lost.

## Application document

```js
{
  jobSlug, jobTitle, name, email, emailLower, phone, link, note,
  resume: { fileId, filename, size, mime } | null,   // file in GridFS "resumes"
  intakeMethod: 'manual' | 'resume',
  source: { utmSource, utmMedium, utmCampaign, referrer },
  consentAt, status: 'new',
  notifications: { hr, candidate },                    // 'sent' or the error
  createdAt, updatedAt
}
```

Until there's an HR screen, browse applications in Atlas (Data Explorer) and
download resumes from the email.

## Data retention

The privacy policy (section 08) promises deletion 12 months after a role
closes. Until that's automated, delete old documents and their GridFS files
periodically, and handle deletion requests from `/data-deletion` by email.

## Not in v1 (planned for v2)

Resume auto-fill, Google sign-in prefill, an HR dashboard with status changes,
and object storage (R2/S3) for resumes.
