import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;

const extractFieldsFromText = (text) => {
  const fields = {
    name: null,
    email: null,
    phone: null
  };

  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    fields.email = emailMatch[0];
  }

  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    fields.phone = phoneMatch[0];
  }

  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    const potentialName = lines[0].trim();
    if (potentialName.length > 2 && potentialName.length < 50 && 
        !potentialName.includes('@') && 
        /^[a-zA-Z\s]+$/.test(potentialName)) {
      fields.name = potentialName;
    }
  }

  return fields;
};

export const parsePDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return extractFieldsFromText(fullText);
};

export const parseDOCX = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return extractFieldsFromText(result.value);
};

export const parseResume = async (file) => {
  if (file.type === 'application/pdf') {
    return await parsePDF(file);
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return await parseDOCX(file);
  } else {
    throw new Error('Unsupported file type. Please upload PDF or DOCX.');
  }
};
