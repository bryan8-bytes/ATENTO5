import crypto from 'crypto';

const sanitize = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .replace(/password=[^&\s]*/gi, 'password=***')
    .replace(/pass=[^&\s]*/gi, 'pass=***')
    .replace(/token=[^&\s]*/gi, 'token=***')
    .replace(/authorization:\s*[^&\s]*/gi, 'authorization: ***')
    .replace(/("pass"\s*:\s*")[^"]*(")/gi, '$1***$2');
};

export const errorHandler = (err, req, res, next) => {
  const requestId = (req.headers && req.headers['x-request-id']) || crypto.randomUUID();
  const safeMessage = err && err.message ? sanitize(err.message) : 'Unknown error';

  console.error(`[ERROR][${requestId}] ${req.method} ${req.originalUrl} :: ${safeMessage}`);

  // Multer upload errors
  if (err && err.name === 'MulterError') {
    return res.status(400).json({
      error: 'Upload Error',
      code: err.code,
      requestId
    });
  }

  // Payload too large (body-parser / json limit)
  if (err && (err.status === 413 || err.statusCode === 413 || err.type === 'entity.too.large')) {
    return res.status(413).json({
      error: 'Payload too large',
      requestId
    });
  }

  // CORS rejection (thrown by the cors middleware)
  if (err && err.message && /not allowed by cors/i.test(err.message)) {
    return res.status(403).json({
      error: 'CORS not allowed',
      requestId
    });
  }

  if (err && err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.message,
      requestId
    });
  }

  if (err && err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      details: err.message,
      requestId
    });
  }

  if (err && err.code === '23505') { // PostgreSQL unique violation
    return res.status(409).json({
      error: 'Conflict',
      details: 'Resource already exists',
      requestId
    });
  }

  if (err && err.code === '23503') { // PostgreSQL foreign key violation
    return res.status(400).json({
      error: 'Bad Request',
      details: 'Related resource not found',
      requestId
    });
  }

  const status = err && (err.status || err.statusCode) ? (err.status || err.statusCode) : 500;
  res.status(status).json({
    error: 'Internal Server Error',
    requestId,
    details: process.env.NODE_ENV === 'development' ? safeMessage : 'An error occurred'
  });
};
