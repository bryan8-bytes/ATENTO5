import React from 'react';

const EmailSignature = ({ signatureHtml }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: signatureHtml }}
    />
  );
};

export default EmailSignature;
