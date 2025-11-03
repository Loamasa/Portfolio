import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CVData {
  profile: {
    fullName: string;
    title?: string | null;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    profileSummary?: string | null;
    coreStrengths?: string[] | string | null;
    languages?: Array<{ language: string; proficiency: string }> | string | null;
  } | null;
  experiences: Array<{
    jobTitle: string;
    company: string;
    location?: string | null;
    startDate: string;
    endDate?: string | null;
    isCurrent: boolean | number;
    overview?: string | null;
    roleCategories?: Array<{ name: string; items: string[] }> | string | null;
    description?: string | null;
  }>;
  education: Array<{
    school: string;
    degree?: string | null;
    field?: string | null;
    location?: string | null;
    startDate: string;
    endDate?: string | null;
    isOngoing: boolean | number;
    overview?: string | null;
    educationSections?: Array<{ name: string; items: string[] }> | string | null;
    website?: string | null;
    eqfLevel?: string | null;
    description?: string | null;
  }>;
  skills: Array<{
    skillName: string;
    category?: string | null;
    proficiency?: string | null;
  }>;
}

export async function generateCVPDF(cvData: CVData, fileName: string = 'cv.pdf') {
  // Create HTML content for the CV
  const htmlContent = createCVHTML(cvData);
  
  // Create a temporary container
  const container = document.createElement('div');
  container.innerHTML = htmlContent;
  container.style.position = 'absolute';
  container.style.left = '-10000px';
  container.style.width = '210mm'; // A4 width
  container.style.padding = '20mm';
  container.style.backgroundColor = 'white';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.lineHeight = '1.6';
  container.style.color = '#333';
  document.body.appendChild(container);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let heightLeft = imgHeight;
    let position = 0;

    // Add images to PDF, handling page breaks
    const imgData = canvas.toDataURL('image/png');
    
    while (heightLeft >= 0) {
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      position = heightLeft - imgHeight;
      
      if (heightLeft > 0) {
        pdf.addPage();
      }
    }

    // Save the PDF
    pdf.save(fileName);
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
}

function createCVHTML(cvData: CVData): string {
  const formatDate = (date: string, isCurrent?: boolean | number) => {
    if (isCurrent === 1 || isCurrent === true) return `${date} - Present`;
    return date;
  };

  const profile = cvData.profile;

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6;">
      <!-- Header -->
      <div style="border-bottom: 2px solid #2c3e50; padding-bottom: 12px; margin-bottom: 16px;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #2c3e50;">
          ${profile?.fullName || 'CV'}
        </h1>
        ${profile?.title ? `<p style="margin: 4px 0; font-size: 14px; color: #3498db; font-weight: 600;">${profile.title}</p>` : ''}
        <div style="font-size: 12px; color: #666; margin-top: 8px;">
          ${profile?.location ? `<span>${profile.location}</span>` : ''}
          ${profile?.phone ? `<span> | ${profile.phone}</span>` : ''}
          ${profile?.email ? `<span> | ${profile.email}</span>` : ''}
        </div>
      </div>

      <!-- Profile Summary -->
      ${profile?.profileSummary ? `
        <div style="margin-bottom: 16px;">
          <h2 style="font-size: 14px; font-weight: bold; color: #2c3e50; margin: 0 0 8px 0; text-transform: uppercase; border-bottom: 1px solid #ecf0f1; padding-bottom: 4px;">
            Professional Summary
          </h2>
          <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #555;">
            ${profile.profileSummary}
          </p>
        </div>
      ` : ''}

      <!-- Core Strengths -->
      ${profile?.coreStrengths ? (() => {
        const strengths = typeof profile.coreStrengths === 'string' ? JSON.parse(profile.coreStrengths) : (Array.isArray(profile.coreStrengths) ? profile.coreStrengths : []);
        return strengths.length > 0 ? `
          <div style="margin-bottom: 16px;">
            <h2 style="font-size: 14px; font-weight: bold; color: #2c3e50; margin: 0 0 8px 0; text-transform: uppercase; border-bottom: 1px solid #ecf0f1; padding-bottom: 4px;">
              Core Strengths
            </h2>
            <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #555;">
              ${strengths.map((strength: string) => `<li style="margin-bottom: 4px;">${strength}</li>`).join('')}
            </ul>
          </div>
        ` : '';
      })() : ''}

      <!-- Experience -->
      ${cvData.experiences.length > 0 ? `
        <div style="margin-bottom: 16px;">
          <h2 style="font-size: 14px; font-weight: bold; color: #2c3e50; margin: 0 0 8px 0; text-transform: uppercase; border-bottom: 1px solid #ecf0f1; padding-bottom: 4px;">
            Experience
          </h2>
          ${cvData.experiences.map(exp => `
            <div style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="font-weight: bold; font-size: 12px; color: #2c3e50;">${exp.jobTitle}</span>
                <span style="font-size: 11px; color: #666;">${formatDate(exp.startDate, exp.isCurrent)} ${exp.endDate ? `- ${exp.endDate}` : ''}</span>
              </div>
              <div style="font-size: 11px; color: #666; margin-bottom: 4px;">
                ${exp.company}${exp.location ? ` | ${exp.location}` : ''}
              </div>
              ${exp.description ? `
                <div style="font-size: 11px; color: #555; white-space: pre-wrap;">
                  ${exp.description}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Education -->
      ${cvData.education.length > 0 ? `
        <div style="margin-bottom: 16px;">
          <h2 style="font-size: 14px; font-weight: bold; color: #2c3e50; margin: 0 0 8px 0; text-transform: uppercase; border-bottom: 1px solid #ecf0f1; padding-bottom: 4px;">
            Education
          </h2>
          ${cvData.education.map(edu => `
            <div style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="font-weight: bold; font-size: 12px; color: #2c3e50;">${edu.school}</span>
                <span style="font-size: 11px; color: #666;">${formatDate(edu.startDate, edu.isOngoing)} ${edu.endDate ? `- ${edu.endDate}` : ''}</span>
              </div>
              ${edu.degree || edu.field ? `
                <div style="font-size: 11px; color: #666; margin-bottom: 4px;">
                  ${edu.degree}${edu.field ? ` in ${edu.field}` : ''}${edu.location ? ` | ${edu.location}` : ''}
                </div>
              ` : ''}
              ${edu.description ? `
                <div style="font-size: 11px; color: #555;">
                  ${edu.description}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Skills -->
      ${cvData.skills.length > 0 ? `
        <div style="margin-bottom: 16px;">
          <h2 style="font-size: 14px; font-weight: bold; color: #2c3e50; margin: 0 0 8px 0; text-transform: uppercase; border-bottom: 1px solid #ecf0f1; padding-bottom: 4px;">
            Skills
          </h2>
          ${(() => {
            const grouped = cvData.skills.reduce((acc, skill) => {
              const cat = skill.category || 'Other';
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(skill);
              return acc;
            }, {} as Record<string, typeof cvData.skills>);
            
            return Object.entries(grouped).map(([category, skills]) => `
              <div style="margin-bottom: 8px;">
                <span style="font-weight: bold; font-size: 11px; color: #2c3e50;">${category}:</span>
                <span style="font-size: 11px; color: #555;">
                  ${skills.map(s => `${s.skillName}${s.proficiency ? ` (${s.proficiency})` : ''}`).join(', ')}
                </span>
              </div>
            `).join('');
          })()}
        </div>
      ` : ''}

      <!-- Languages -->
      ${profile?.languages && profile.languages.length > 0 ? `
        <div>
          <h2 style="font-size: 14px; font-weight: bold; color: #2c3e50; margin: 0 0 8px 0; text-transform: uppercase; border-bottom: 1px solid #ecf0f1; padding-bottom: 4px;">
            Languages
          </h2>
          <div style="font-size: 11px; color: #555;">
            ${(() => {
              const langs = typeof profile.languages === 'string' ? JSON.parse(profile.languages) : (Array.isArray(profile.languages) ? profile.languages : []);
              return langs.map((lang: any) => `
                <div style="margin-bottom: 4px;">
                  <span style="font-weight: 600;">${lang.language}</span> - ${lang.proficiency}
                </div>
              `).join('');
            })()}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

