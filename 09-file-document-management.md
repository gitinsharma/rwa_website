1. Storage Provider Strategy (Single-Node)

To completely eliminate recurring cloud storage costs for the demo phase, the system will self-host file storage while maintaining API compatibility with cloud providers for future scaling.

    MinIO Docker Container: Runs an S3-compatible object store locally on the single VPS instance.

    Code Portability: The Next.js application will still use standard AWS S3 SDK commands to generate presigned URLs and upload files. If the application outgrows the VPS, switching to AWS S3 or Cloudflare R2 requires changing exactly zero lines of code—only updating the environment variables.

    Volume Mapping: Physical files are stored directly on the VPS disk via Docker volumes, protected by the server's OS-level security.

2. Bucket Policies & Access

    Public Assets: MinIO will be configured with a public bucket policy. A reverse proxy will serve these files directly to residents (e.g., files.sector43rwa.in) without routing through the Next.js container.

    Write Protection: Uploads strictly require the authenticated Next.js backend to generate a MinIO presigned URL.