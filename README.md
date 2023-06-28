## Speech Sample Collection (App)

3-tier architecture. 
- Frontend (React),
  Simple react app deployed in the aws s3 and aws CloudFront is used as CDN. We are not using any ALB or Domain to save aws costs. 
- Backend (FastAPI),
  Simple fast API endpoint which
      samples a prompt from the DB (randomly),
      update the prompt's record in the DB with the audio URL,
      provides pre-signed s3 url to the frontend which the frontend used to dump audio files to the s3 bucket.
- DB (MongoDB).
  Prefilled with physics sentences
- Additionally, aws s3 is used to store the audio files.

Note: this is the AWS deployment, we are working on shifting it entirely to the on-prem servers (code and audio files).
