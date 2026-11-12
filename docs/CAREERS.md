# Careers page (v1)

`/careers` lists open roles, `/careers/<slug>` is each role's own page (indexed by
Google for Jobs), and candidates apply without an account. Applications are saved
to MongoDB Atlas, resumes (PDF, max 5 MB) to Cloudinary, and HR is emailed
through Resend.

## Go-live checklist

1. **Roles** live in `src/lib/careers/jobs.js` (currently: Digital Marketing
   Manager). Add `salary` once it's confirmed, and check `validThrough`,
   `REVIEW_PROMISE` (the timeline promised to candidates) and `CAREERS_EMAIL`.
2. **MongoDB Atlas**
   - Create a database user with read/write on the `gorevive` database.
   - Network Access: allow your server's IP. On Vercel, either allow
     `0.0.0.0/0` (with a strong password) or use the Vercel ↔ Atlas integration.
   - Set `MONGODB_URI` and `MONGODB_DB`. Indexes are created automatically on
     the first application.
3. **Resend**
   - Add and verify the domain `gorevive.in` (add the SPF/DKIM DNS records
     Resend shows). Emails won't send from an unverified domain.
   - Set `RESEND_API_KEY`, `CAREERS_FROM`, `CAREERS_INBOX`, and `CAREERS_BCC`
     (gets a silent copy of every HR notification).
4. **Cloudinary**
   - Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
   - Free plans block PDF delivery by default. If HR emails arrive without the
     resume attached, or the download link fails, turn on **Settings →
     Security → Allow delivery of PDF and ZIP files**. Resumes stay private
     either way: they're uploaded as `private` and only reachable through
     signed, expiring links.
5. **Rate limit behind a proxy/CDN:** set `TRUSTED_IP_HEADER` (already used by
   the login limiter) so the 10-applications-per-10-minutes limit is per real IP.
6. Submit a test application with and without a resume and check both emails.

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
| Resume upload signature | `src/app/api/careers/resume-upload/route.js` |
| Cloudinary (sign, verify, download, tag, delete) | `src/lib/server/cloudinary.js` |
| MongoDB | `src/lib/server/mongo.js`, `src/lib/server/careers.js` |
| Emails | `src/lib/server/email.js` |

**Resume upload (only if the candidate attaches one):**
1. The browser asks `/api/careers/resume-upload` for a signed upload. The
   server picks the file's public ID (`<folder>/<role>/<uuid>`), fixes
   `type: private`, `allowed_formats: pdf` and the tag `careers_unsubmitted`,
   and returns the signature plus an encrypted ticket naming that file.
2. The browser uploads the PDF straight to Cloudinary (with a progress bar).
   Cloudinary rejects anything that isn't a real PDF. The file never passes
   through our API, so the 5 MB limit works on Vercel too.

**Submission flow:** rate limit → honeypot check → role open? → consent →
validate fields → read the resume ticket → duplicate check (one application
per email per role) → confirm via the Cloudinary Admin API that the file is a
PDF ≤ 5 MB (otherwise it's deleted and rejected) → save the application to
`job_applications` → retag the resume `careers_application` → email HR
(resume attached, a 7-day download link, reply-to = candidate, Bcc =
`CAREERS_BCC`) and the candidate → record email results on the application.

If email fails, the application is still saved and the failure is logged and
stored on the document, so nothing is lost. If the resume can't be attached,
the HR email still has the download link and the Cloudinary public ID.

**Orphaned uploads:** a candidate can upload a resume and then leave without
applying. Those files keep the tag `careers_unsubmitted`. Filter the Media
Library by that tag now and then and delete anything older than a day.

## Application document

```js
{
  jobSlug, jobTitle, name, email, emailLower, phone, link, note,
  resume: { publicId, filename, bytes, pages, uploadedAt } | null, // Cloudinary, type private
  intakeMethod: 'manual' | 'resume',
  source: { utmSource, utmMedium, utmCampaign, referrer },
  consentAt, status: 'new',
  notifications: { hr, candidate },                    // 'sent' or the error
  createdAt, updatedAt
}
```

Until there's an HR screen, browse applications in Atlas (Data Explorer) and
download resumes from the email, or from the Cloudinary Media Library using
the `resume.publicId`.

## Data retention

The privacy policy (section 08) promises deletion 12 months after a role
closes. Until that's automated, delete old documents
and their Cloudinary resumes periodically, and handle deletion requests from
`/data-deletion` by email (delete both the document and the resume).

## Not in v1 (planned for v2)

Resume auto-fill, Google sign-in prefill, an HR dashboard with status changes,
and object storage (R2/S3) for resumes.
