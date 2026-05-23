import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const [text, setText] = useState('Edit me');

  return (
    <div>
      <h1>Test</h1>
      <div 
        contentEditable={true} 
        suppressContentEditableWarning={true}
        onBlur={(e) => {
          console.log("onBlur triggered, value:", e.currentTarget.textContent);
          setText(e.currentTarget.textContent);
        }}
        dangerouslySetInnerHTML={{ __html: text || 'Fallback' }}
        style={{ border: '1px solid black', padding: '10px' }}
      />
      <p>State: {text}</p>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
