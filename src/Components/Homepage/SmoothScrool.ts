// utils/smoothScroll.ts
import { useEffect } from 'react';

export const useSmoothScroll = () => {
  useEffect(() => {
    // Function to handle smooth scrolling for anchor links
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if the clicked element is an anchor link
      if (target.tagName === 'A') {
        const href = target.getAttribute('href');
        
        // Only process internal links that start with #
        if (href && href.startsWith('#')) {
          e.preventDefault();
          
          const targetElement = document.querySelector(href);
          if (targetElement) {
            // Smooth scroll to the target element
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
            
            // Update URL hash without jumping
            history.pushState(null, '', href);
          }
        }
      }
    };

    // Add event listener
    document.addEventListener('click', handleSmoothScroll);
    
    // Clean up
    return () => {
      document.removeEventListener('click', handleSmoothScroll);
    };
  }, []);
};

// Function to scroll to top with smooth behavior
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};