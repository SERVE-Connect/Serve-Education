import fs from 'fs';

const content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const startStr = "  const downloadResume = (templateId: string = 'simple') => {";
const endStr = "  };\n\n  const completionPercentage = calculateCompletion(profile);";

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const newFunc = `  const downloadResume = async (templateId: string = 'simple') => {
    try {
      setSaving(true);
      await exportResumeToPDF(profile as unknown as StudentProfile, templateId);
      setToast({ message: 'Resume downloaded successfully!', isVisible: true });
    } catch (error) {
      console.error('Error generating resume:', error);
      setToast({ message: 'Error generating PDF. Please try again.', isVisible: true });
    } finally {
      setSaving(false);
    }
  };\n\n  const completionPercentage = calculateCompletion(profile);`;
  
  const newContent = content.substring(0, startIndex) + newFunc + content.substring(endIndex + endStr.length);
  fs.writeFileSync('src/components/Profile.tsx', newContent);
  console.log('Replaced successfully');
} else {
  console.log('Could not find start or end string');
}
