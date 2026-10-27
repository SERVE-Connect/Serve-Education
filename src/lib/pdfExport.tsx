import jsPDF from 'jspdf';
import { toJpeg } from 'html-to-image';
import { GuidanceResult, StudentProfile } from '../types';
import { createRoot } from 'react-dom/client';
import { PrintLayout } from '../components/PrintLayout';
import { ResumePreview } from '../components/ResumePreview';
import { LanguageProvider } from '../contexts/LanguageContext';
import React from 'react';

export async function exportResumeToPDF(profile: StudentProfile, templateId: string) {
  console.log('PDF Export: Starting Resume export...');
  
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  const container = document.createElement('div');
  container.id = 'pdf-resume-container';
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '1000px';
  container.style.zIndex = '-9999';
  container.style.opacity = '0.01';
  container.style.pointerEvents = 'none';
  container.style.overflow = 'hidden';
  container.className = 'bg-white text-slate-900 font-sans force-light';
  document.body.appendChild(container);

  try {
    const root = createRoot(container);
    
    await new Promise<void>((resolve) => {
      root.render(
        <LanguageProvider>
          <ResumePreview profile={profile} templateId={templateId} isExport={true} />
        </LanguageProvider>
      );
      setTimeout(resolve, 1000);
    });

    const dataUrl = await toJpeg(container.querySelector('#resume-content') as HTMLElement || container, {
      quality: 0.95,
      pixelRatio: 2,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      }
    });

    const imgProps = doc.getImageProperties(dataUrl);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    let heightLeft = pdfHeight;
    let position = 0;

    doc.addImage(dataUrl, 'JPEG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    // Use a 1mm threshold to prevent an extra blank page if heightLeft is very close to 0
    while (heightLeft > 1) {
      position = heightLeft - pdfHeight;
      doc.addPage();
      doc.addImage(dataUrl, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    doc.save(`Resume_${profile.fullName?.replace(/\s+/g, '_') || 'Margdarshak'}.pdf`);
    root.unmount();
  } catch (error) {
    console.error('PDF Export: Critical failure:', error);
    alert('Error generating PDF. Please try again.');
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

export async function exportToPDF(result: GuidanceResult, username?: string) {
  console.log('PDF Export: Starting React-based high-fidelity process...', { career: result.recommendedCareer });
  
  if (!result || !result.slides || result.slides.length === 0) {
    console.error('PDF Export: No slides found in result data');
    return;
  }

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Create a hidden container for rendering slides
  const container = document.createElement('div');
  container.id = 'pdf-export-container';
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '896px'; // Match presentation max-w-4xl for consistent text size
  container.style.zIndex = '-9999';
  container.style.opacity = '0.01';
  container.style.pointerEvents = 'none';
  container.style.overflow = 'hidden';
  container.className = 'bg-white text-slate-900 font-sans force-light';
  document.body.appendChild(container);

  try {
    // Render the React component tree into the container
    const root = createRoot(container);
    
    // We wrap in a Promise to wait for React to render
    await new Promise<void>((resolve) => {
      root.render(
        <LanguageProvider>
          <PrintLayout result={result} username={username} />
        </LanguageProvider>
      );
      // Give React time to mount and Recharts time to render
      setTimeout(resolve, 1500);
    });

    const captureElement = async (element: HTMLElement, slideTitle: string) => {
      console.log(`PDF Export: Rendering "${slideTitle}"...`);
      
      try {
        // Use html-to-image which relies on native browser SVG rendering
        // This completely bypasses the CSS parsing issues of html2canvas
        const dataUrl = await toJpeg(element, {
          quality: 0.95,
          pixelRatio: 2,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
          }
        });
        
        return dataUrl;
      } catch (error) {
        console.error(`PDF Export: Error capturing "${slideTitle}":`, error);
        throw error;
      }
    };

    // 1. Title Page
    const titlePageEl = container.querySelector('#pdf-title-page') as HTMLElement;
    if (titlePageEl) {
      const titleImg = await captureElement(titlePageEl, 'Title Page');
      doc.addImage(titleImg, 'JPEG', 0, 0, pageWidth, pageHeight);
    }

    // 2. Content Slides
    for (let i = 0; i < result.slides.length; i++) {
      const slide = result.slides[i];
      const slideEl = container.querySelector(`[data-slide-index="${i}"]`) as HTMLElement;
      
      if (slideEl) {
        const slideImg = await captureElement(slideEl, slide.title);
        doc.addPage();
        doc.addImage(slideImg, 'JPEG', 0, 0, pageWidth, pageHeight);
      }
    }

    console.log('PDF Export: Finalizing document...');
    doc.save(`Margdarshak_Career_Report_${result.recommendedCareer.replace(/\s+/g, '_')}.pdf`);
    console.log('PDF Export: Success!');
    
    // Cleanup React root
    root.unmount();
  } catch (error) {
    console.error('PDF Export: Critical failure:', error);
    alert('Error generating PDF. Please try again.');
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
