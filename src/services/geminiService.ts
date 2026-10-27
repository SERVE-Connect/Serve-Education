import { GoogleGenAI } from "@google/genai";
import { StudentProfile, GuidanceResult, CareerSlide } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateGuidance(profile: StudentProfile): Promise<GuidanceResult> {
  const prompt = `
    As an expert educational and career counselor in India, provide comprehensive guidance for a student with the following profile:
    - Grade: ${profile.grade}
    - Interests: ${profile.interests?.join(", ") || 'Not provided'}
    - Strengths: ${profile.strengths?.join(", ") || 'Not provided'}
    - Career Aspirations: ${profile.aspirations || 'Not provided'}
    - Preferred Subjects: ${profile.preferredSubjects?.join(", ") || 'Not provided'}
    - Education: ${profile.education?.map(e => `${e.degree} from ${e.school} (${e.year})`).join(' | ') || 'Not provided'}
    - Skills: ${profile.skills?.join(", ") || 'Not provided'}
    - Projects: ${profile.projects?.map(p => `${p.name}: ${p.description}`).join(' | ') || 'Not provided'}
    - Experience: ${profile.isFresher ? 'Fresher (No formal experience)' : profile.experience?.map(e => `${e.role} at ${e.company} (${e.duration}): ${e.description}`).join(' | ')}

    Based on this, suggest the most suitable career path and educational stream (e.g., Science (PCM - Physics, Chemistry, Math & CS), Science (PCMB - Bio-Engineering & Biophysics), Science (PCB - Biomedical Sciences), Interdisciplinary Cognitive Sciences & AI, Commerce, Humanities, or Vocational).
    
    Format the response as a JSON object with the following structure:
    {
      "recommendedCareer": "string",
      "recommendedStream": "string",
      "relatedCareers": ["string", "string", "string"],
      "eligibilityScore": 85, // A score out of 100
      "eligibilityCriteria": [
        { "label": "Academic Fit", "score": 90, "feedback": "Your preferred subjects align perfectly." },
        { "label": "Skill Alignment", "score": 80, "feedback": "Your strengths in analytical thinking are key." },
        { "label": "Interest Match", "score": 85, "feedback": "High passion for technology noted." }
      ],
      "improvementAreas": [
        { "skill": "Public Speaking", "description": "Need to improve confidence in groups.", "impact": "Essential for leadership roles." }
      ],
      "suggestedCourses": [
        { "title": "Advanced Python for Data Science", "platform": "Coursera", "link": "https://coursera.org", "duration": "4 weeks" },
        { "title": "Critical Thinking & Logic", "platform": "Udemy", "link": "https://udemy.com", "duration": "10 hours" }
      ],
      "scholarships": [
        { "name": "Kishore Vaigyanik Protsahan Yojana (KVPY)", "provider": "DST, Govt. of India", "amount": "₹5,000 - ₹7,000 pm", "eligibility": "Class 11 to 1st year UG in basic sciences", "link": "http://kvpy.iisc.ernet.in" }
      ],
      "sponsorships": [
        { "name": "Google Generation Scholarship", "company": "Google", "description": "For women in computer science.", "link": "https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship-apac" }
      ],
      "internships": [
        { "title": "Software Engineering Intern", "company": "Microsoft India", "duration": "2 months", "type": "Hybrid", "stipend": "₹50,000 pm", "link": "https://careers.microsoft.com" }
      ],
      "slides": [
        {
          "title": "Eligibility Analysis",
          "content": "A detailed breakdown of why the student is eligible for this career based on their profile. Use markdown.",
          "type": "skills" 
        },
        {
          "title": "Skill Gap & Courses",
          "content": "Identify specific areas where the student can improve to be more successful in this career. Suggest courses to bridge these gaps. Use markdown.",
          "type": "skills"
        },
        {
          "title": "Scholarships & Sponsorships",
          "content": "List specific scholarships and corporate sponsorships available for this career path in India. Use markdown.",
          "type": "skills"
        },
        {
          "title": "Internship Opportunities",
          "content": "List specific internship opportunities for students in this field, including both technical and non-technical roles. Use markdown.",
          "type": "market"
        },
        {
          "title": "Educational Roadmap",
          "content": "Step-by-step path from ${profile.grade} to the career goal (exams like JEE, NEET, CLAT, etc. if applicable).",
          "type": "roadmap"
        },
        {
          "title": "Current Scenario in India",
          "content": "Market demand, top institutions in India, average starting salaries, and current industry landscape.",
          "type": "market",
          "data": [ {"name": "Entry Level", "value": 400000}, {"name": "Mid Level", "value": 1200000}, {"name": "Senior Level", "value": 2500000} ]
        },
        {
          "title": "Future Outlook (2030+)",
          "content": "How AI and technology will change this field, future demand assumptions, and global trends.",
          "type": "future"
        },
        {
          "title": "Key Skills to Develop",
          "content": "Technical and soft skills the student should start working on now.",
          "type": "skills"
        }
      ]
    }

    Use Google Search to ensure the data about top colleges, salaries, and future trends in India is accurate and up-to-date.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    
    if (!result.slides || !Array.isArray(result.slides) || result.slides.length === 0) {
      throw new Error("Invalid response format: missing slides");
    }
    
    return result as GuidanceResult;
  } catch (error) {
    console.error("Error generating guidance:", error);
    throw error;
  }
}
