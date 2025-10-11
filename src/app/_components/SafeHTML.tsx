interface SafeHTMLProps {
  html: string;
  className?: string;
}

export default function SafeHTML({ html, className }: SafeHTMLProps) {
  // Simple function to make HTML safe
  function makeHTMLSafe(htmlString: string) {
    if (!htmlString) return '';
    
    // Remove dangerous tags that could run JavaScript
    let safeHTML = htmlString;
    
    // Remove script tags (most dangerous)
    safeHTML = safeHTML.replace(/<script[^>]*>.*?<\/script>/gi, '');
    
    // Remove iframe tags (can load external content)
    safeHTML = safeHTML.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
    
    // Remove onclick and other dangerous attributes
    safeHTML = safeHTML.replace(/onclick="[^"]*"/gi, '');
    safeHTML = safeHTML.replace(/onload="[^"]*"/gi, '');
    safeHTML = safeHTML.replace(/onerror="[^"]*"/gi, '');
    
    return safeHTML;
  }

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: makeHTMLSafe(html) }}
    />
  );
}
