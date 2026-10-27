import React from 'react';
import { StudentProfile } from '../types';

interface ResumePreviewProps {
  profile: StudentProfile;
  templateId: string;
  isExport?: boolean;
}

export function ResumePreview({ profile, templateId, isExport = false }: ResumePreviewProps) {
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formattedPhone = profile.phone ? `+91 ${profile.phone.replace(/^\+91\s*/, '')}` : '';
  const formattedLinkedin = profile.linkedin ? `https://linkedin.com/in/${profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}` : '';
  const age = calculateAge(profile.birthDate);
  const formattedBirthDate = profile.birthDate ? `${formatDate(profile.birthDate)}${age ? ` (${age} Yrs)` : ''}` : '';

  const contactInfo = [
    profile.email,
    formattedPhone,
    profile.location,
    formattedLinkedin,
    formattedBirthDate
  ].filter(Boolean);

  // A4 dimensions at 96dpi: 794px x 1123px
  // We use a wrapper to scale down the preview to fit the container without horizontal scrolling
  const PageWrapper = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [scale, setScale] = React.useState(1);
    const [height, setHeight] = React.useState(1123);
    const [isZoomed, setIsZoomed] = React.useState(false);

    React.useEffect(() => {
      if (isExport) return;

      const updateLayout = () => {
        if (containerRef.current && contentRef.current) {
          const containerWidth = containerRef.current.clientWidth;
          const containerHeight = containerRef.current.clientHeight;
          const availableWidth = containerWidth - 32; // 16px padding on each side
          const availableHeight = containerHeight - 32; // 16px padding top/bottom
          
          const scaleX = availableWidth / 794;
          const scaleY = availableHeight / 1123;
          
          const newScale = Math.min(1, scaleX, scaleY);
          setScale(newScale);
          setHeight(contentRef.current.offsetHeight);
        }
      };

      const observer = new ResizeObserver(updateLayout);
      if (containerRef.current) observer.observe(containerRef.current);
      if (contentRef.current) observer.observe(contentRef.current);

      updateLayout();
      return () => observer.disconnect();
    }, [isExport]);

    if (isExport) {
      return (
        <div id="resume-content" className={`w-[794px] min-h-[1123px] bg-white ${className}`}>
          {children}
        </div>
      );
    }

    const actualScale = isZoomed ? scale * 2 : scale;

    return (
      <div 
        ref={containerRef} 
        className={`w-full h-full bg-slate-100 dark:bg-slate-900 flex justify-center ${isZoomed ? 'overflow-auto items-start py-8' : 'overflow-hidden items-center'}`}
        onClick={() => setIsZoomed(!isZoomed)}
        style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
      >
        <div
          style={{
            width: '794px',
            transform: `scale(${actualScale})`,
            transformOrigin: isZoomed ? 'top center' : 'center center',
            marginBottom: isZoomed ? `${height * (actualScale - 1)}px` : '0',
            transition: 'transform 0.3s ease-in-out, margin 0.3s ease-in-out'
          }}
          className="shrink-0 flex justify-center"
        >
          <div ref={contentRef} id="resume-content" className={`w-full min-h-[1123px] bg-white shadow-lg ${className}`}>
            {children}
          </div>
        </div>
      </div>
    );
  };

  if (templateId === 'simple') {
    return (
      <PageWrapper className="p-[40px] text-black font-sans">
        <div className="text-center mb-6">
          <h1 className="text-[28px] font-bold uppercase mb-2 leading-none">{profile.fullName}</h1>
          {contactInfo.length > 0 && (
            <div className="text-[13px] text-gray-800">
              {contactInfo.join(' | ')}
            </div>
          )}
        </div>

        {profile.summary && (
          <div className="mb-5">
            <h2 className="text-[16px] font-bold uppercase mb-1">Professional Summary</h2>
            <div className="w-full h-[1px] bg-black mb-2"></div>
            <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{profile.summary}</p>
          </div>
        )}

        {profile.experience && profile.experience.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[16px] font-bold uppercase mb-1">Experience</h2>
            <div className="w-full h-[1px] bg-black mb-2"></div>
            <div className="space-y-3">
              {profile.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[13px] font-bold">{exp.role}</h3>
                    <span className="text-[13px]">{exp.duration}</span>
                  </div>
                  <div className="text-[13px] italic mb-1">{exp.company}</div>
                  <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.education && profile.education.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[16px] font-bold uppercase mb-1">Education</h2>
            <div className="w-full h-[1px] bg-black mb-2"></div>
            <div className="space-y-3">
              {profile.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[13px] font-bold">{edu.degree}</h3>
                    <span className="text-[13px]">{edu.year}</span>
                  </div>
                  <div className="text-[13px]">{edu.school}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.projects && profile.projects.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[16px] font-bold uppercase mb-1">Projects</h2>
            <div className="w-full h-[1px] bg-black mb-2"></div>
            <div className="space-y-3">
              {profile.projects.map((project, i) => (
                <div key={i}>
                  <h3 className="text-[13px] font-bold">{project.name}</h3>
                  {project.link && <div className="text-[13px] text-indigo-600 mb-1">{project.link}</div>}
                  <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.skills && profile.skills.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[16px] font-bold uppercase mb-1">Skills</h2>
            <div className="w-full h-[1px] bg-black mb-2"></div>
            <div className="text-[13px] leading-relaxed">
              {profile.skills.join(' • ')}
            </div>
          </div>
        )}

        {profile.careerAspirations && (
          <div className="mb-5">
            <h2 className="text-[16px] font-bold uppercase mb-1">Career Aspirations</h2>
            <div className="w-full h-[1px] bg-black mb-2"></div>
            <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{profile.careerAspirations}</p>
          </div>
        )}
      </PageWrapper>
    );
  }

  if (templateId === 'modern') {
    return (
      <PageWrapper className="flex font-sans text-slate-900">
        {/* Left Column */}
        <div className="w-[245px] bg-slate-800 shrink-0 min-h-full">
          <div className="p-[40px] pt-[60px]">
            <div className="w-[60px] h-[60px] bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 text-[32px] font-bold mb-[45px] mx-auto">
              {(profile.fullName?.charAt(0) || 'U').toUpperCase()}
            </div>
            
            <div className="mb-[40px] space-y-[10px] text-[12px] text-white break-words">
              {profile.email && <div>{profile.email}</div>}
              {formattedPhone && <div>{formattedPhone}</div>}
              {profile.location && <div>{profile.location}</div>}
              {formattedLinkedin && <div>{formattedLinkedin}</div>}
              {formattedBirthDate && <div>{formattedBirthDate}</div>}
            </div>

            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h2 className="text-[16px] font-bold text-yellow-400 mb-[8px] uppercase tracking-wider">Skills</h2>
                <div className="w-full h-[1px] bg-slate-600 mb-[12px]"></div>
                <div className="space-y-[6px] text-[12px] text-slate-200">
                  {profile.skills.map((skill, i) => (
                    <div key={i}>• {skill}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column */}
        <div className="flex-1 bg-white p-[40px] pt-[60px]">
          <div className="mb-[40px]">
            <h1 className="text-[36px] font-bold text-slate-900 mb-[10px] uppercase leading-tight">{profile.fullName}</h1>
            {profile.summary && <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">{profile.summary}</p>}
          </div>

          {profile.experience && profile.experience.length > 0 && (
            <div className="mb-[30px]">
              <h2 className="text-[18px] font-bold text-slate-800 mb-[8px] uppercase tracking-wider">Experience</h2>
              <div className="w-full h-[2px] bg-yellow-400 mb-[16px]"></div>
              <div className="space-y-[20px]">
                {profile.experience.map((exp, i) => (
                  <div key={i} className="relative pl-[16px]">
                    <div className="absolute w-[6px] h-[6px] bg-yellow-400 rounded-full left-0 top-[6px]"></div>
                    <h3 className="font-bold text-slate-800 text-[16px]">{exp.role}</h3>
                    <div className="text-[13px] font-bold text-indigo-600 mb-[4px]">{exp.company} | {exp.duration}</div>
                    <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.education && profile.education.length > 0 && (
            <div className="mb-[30px]">
              <h2 className="text-[18px] font-bold text-slate-800 mb-[8px] uppercase tracking-wider">Education</h2>
              <div className="w-full h-[2px] bg-yellow-400 mb-[16px]"></div>
              <div className="space-y-[16px]">
                {profile.education.map((edu, i) => (
                  <div key={i} className="relative pl-[16px]">
                    <div className="absolute w-[6px] h-[6px] bg-yellow-400 rounded-full left-0 top-[6px]"></div>
                    <h3 className="font-bold text-slate-800 text-[14px]">{edu.degree}</h3>
                    <div className="text-[13px] text-slate-600">{edu.school}</div>
                    <div className="text-[13px] font-bold text-indigo-600">{edu.year}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.projects && profile.projects.length > 0 && (
            <div className="mb-[30px]">
              <h2 className="text-[18px] font-bold text-slate-800 mb-[8px] uppercase tracking-wider">Projects</h2>
              <div className="w-full h-[2px] bg-yellow-400 mb-[16px]"></div>
              <div className="space-y-[16px]">
                {profile.projects.map((project, i) => (
                  <div key={i}>
                    <h3 className="font-bold text-slate-800 text-[14px]">{project.name}</h3>
                    {project.link && <div className="text-[12px] text-indigo-600 mb-[4px]">{project.link}</div>}
                    <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.careerAspirations && (
            <div className="mb-[30px]">
              <h2 className="text-[18px] font-bold text-slate-800 mb-[8px] uppercase tracking-wider">Aspirations</h2>
              <div className="w-full h-[2px] bg-yellow-400 mb-[16px]"></div>
              <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">{profile.careerAspirations}</p>
            </div>
          )}
        </div>
      </PageWrapper>
    );
  }

  if (templateId === 'creative') {
    return (
      <PageWrapper className="bg-slate-800 text-slate-400 font-sans p-[40px]">
        <div className="mb-[40px] pt-[20px]">
          <h1 className="text-[42px] font-bold text-emerald-500 mb-[16px] uppercase leading-none">{profile.fullName}</h1>
          {contactInfo.length > 0 && (
            <div className="text-[13px] text-slate-400 mb-[20px]">
              {contactInfo.join('  •  ')}
            </div>
          )}
          {profile.summary && (
            <p className="text-[14px] text-slate-100 leading-relaxed whitespace-pre-wrap">{profile.summary}</p>
          )}
        </div>

        {profile.skills && profile.skills.length > 0 && (
          <div className="mb-[30px]">
            <div className="flex items-center gap-[10px] mb-[16px]">
              <div className="w-[12px] h-[32px] bg-emerald-500"></div>
              <h2 className="text-[21px] font-bold text-white uppercase tracking-wider m-0">Skills</h2>
            </div>
            <div className="text-[13px] font-bold text-emerald-500 leading-relaxed">
              {profile.skills.join('   |   ')}
            </div>
          </div>
        )}

        {profile.experience && profile.experience.length > 0 && (
          <div className="mb-[30px]">
            <div className="flex items-center gap-[10px] mb-[16px]">
              <div className="w-[12px] h-[32px] bg-emerald-500"></div>
              <h2 className="text-[21px] font-bold text-white uppercase tracking-wider m-0">Experience</h2>
            </div>
            <div className="space-y-[20px]">
              {profile.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-[4px]">
                    <h3 className="font-bold text-slate-100 text-[16px]">{exp.role}</h3>
                    <span className="text-[13px] text-emerald-500">{exp.duration}</span>
                  </div>
                  <div className="text-[13px] italic text-slate-400 mb-[8px]">{exp.company}</div>
                  <p className="text-[13px] text-slate-400 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.education && profile.education.length > 0 && (
          <div className="mb-[30px]">
            <div className="flex items-center gap-[10px] mb-[16px]">
              <div className="w-[12px] h-[32px] bg-emerald-500"></div>
              <h2 className="text-[21px] font-bold text-white uppercase tracking-wider m-0">Education</h2>
            </div>
            <div className="space-y-[16px]">
              {profile.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-[4px]">
                    <h3 className="font-bold text-slate-100 text-[16px]">{edu.degree}</h3>
                    <span className="text-[13px] text-emerald-500">{edu.year}</span>
                  </div>
                  <div className="text-[13px] text-slate-400">{edu.school}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.projects && profile.projects.length > 0 && (
          <div className="mb-[30px]">
            <div className="flex items-center gap-[10px] mb-[16px]">
              <div className="w-[12px] h-[32px] bg-emerald-500"></div>
              <h2 className="text-[21px] font-bold text-white uppercase tracking-wider m-0">Projects</h2>
            </div>
            <div className="space-y-[20px]">
              {profile.projects.map((project, i) => (
                <div key={i}>
                  <h3 className="font-bold text-slate-100 text-[16px] mb-[4px]">{project.name}</h3>
                  {project.link && <div className="text-[12px] text-emerald-500 mb-[8px]">{project.link}</div>}
                  <p className="text-[13px] text-slate-400 leading-relaxed whitespace-pre-wrap">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.careerAspirations && (
          <div className="mb-[30px]">
            <div className="flex items-center gap-[10px] mb-[16px]">
              <div className="w-[12px] h-[32px] bg-emerald-500"></div>
              <h2 className="text-[21px] font-bold text-white uppercase tracking-wider m-0">Aspirations</h2>
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed whitespace-pre-wrap">{profile.careerAspirations}</p>
          </div>
        )}
      </PageWrapper>
    );
  }

  // Fallback for professional or any other template
  return (
    <PageWrapper className="p-[40px] text-slate-800 font-sans border-t-[12px] border-indigo-700">
      <div className="flex justify-between items-end mb-[30px] border-b-[2px] border-slate-200 pb-[20px]">
        <div>
          <h1 className="text-[36px] font-bold text-indigo-900 mb-[8px] uppercase tracking-wider leading-none">{profile.fullName}</h1>
          {profile.careerAspirations && <h2 className="text-[18px] text-slate-500">{profile.careerAspirations}</h2>}
        </div>
        <div className="text-right text-[12px] text-slate-600 space-y-[4px]">
          {profile.email && <div>{profile.email}</div>}
          {formattedPhone && <div>{formattedPhone}</div>}
          {profile.location && <div>{profile.location}</div>}
          {formattedLinkedin && <div>{formattedLinkedin}</div>}
        </div>
      </div>

      <div className="flex gap-[30px]">
        <div className="w-[65%]">
          {profile.summary && (
            <div className="mb-[24px]">
              <h2 className="text-[16px] font-bold text-indigo-800 mb-[8px] uppercase tracking-wider">Profile</h2>
              <p className="text-[13px] leading-relaxed text-slate-700 whitespace-pre-wrap">{profile.summary}</p>
            </div>
          )}

          {profile.experience && profile.experience.length > 0 && (
            <div className="mb-[24px]">
              <h2 className="text-[16px] font-bold text-indigo-800 mb-[12px] uppercase tracking-wider">Professional Experience</h2>
              <div className="space-y-[20px]">
                {profile.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-[4px]">
                      <h3 className="font-bold text-slate-900 text-[16px]">{exp.role}</h3>
                      <span className="text-[13px] text-indigo-600 font-medium">{exp.duration}</span>
                    </div>
                    <div className="text-[13px] font-medium text-slate-700 mb-[8px]">{exp.company}</div>
                    <p className="text-[13px] text-slate-600 whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.projects && profile.projects.length > 0 && (
            <div className="mb-[24px]">
              <h2 className="text-[16px] font-bold text-indigo-800 mb-[12px] uppercase tracking-wider">Key Projects</h2>
              <div className="space-y-[16px]">
                {profile.projects.map((project, i) => (
                  <div key={i}>
                    <div className="flex items-baseline gap-[8px] mb-[4px]">
                      <h3 className="font-bold text-slate-900 text-[14px]">{project.name}</h3>
                      {project.link && <span className="text-[12px] text-indigo-600">{project.link}</span>}
                    </div>
                    <p className="text-[13px] text-slate-600 whitespace-pre-wrap">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-[35%] space-y-[24px]">
          {profile.skills && profile.skills.length > 0 && (
            <div>
              <h2 className="text-[16px] font-bold text-indigo-800 mb-[12px] uppercase tracking-wider">Core Competencies</h2>
              <ul className="list-disc list-inside text-[13px] text-slate-700 space-y-[4px]">
                {profile.skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>
          )}

          {profile.education && profile.education.length > 0 && (
            <div>
              <h2 className="text-[16px] font-bold text-indigo-800 mb-[12px] uppercase tracking-wider">Education</h2>
              <div className="space-y-[16px]">
                {profile.education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="font-bold text-slate-900 text-[14px]">{edu.degree}</h3>
                    <div className="text-[13px] text-slate-700">{edu.school}</div>
                    <div className="text-[13px] text-indigo-600 font-medium">{edu.year}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
