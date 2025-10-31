import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface BioContent {
  quote: string;
  age: number;
  role: string;
  years: number;
  whoIsGray: string;
  background: string;
  expertise: string;
  personality: string;
  dailyLife: {
    dawnRitual: string;
    theDrinker: string;
    theWriter: string;
    confessional: string;
  };
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface ThatBarContent {
  floors: {
    downstairs: string;
    upstairs: string;
    theLoft: string;
  };
  ringSystem: {
    description: string;
    origin: string;
  };
  loftLife: string[];
}

export interface Plot {
  title: string;
  tag: string;
  description: string;
}

function parseBioContent(content: string): any {
  const sections: any = {};
  const lines = content.split('\n');
  let currentSection = '';
  let currentContent: string[] = [];
  
  lines.forEach(line => {
    if (line.startsWith('## ')) {
      if (currentSection && currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      currentSection = line.replace('## ', '').trim();
      currentContent = [];
    } else if (line.trim() && !line.startsWith('#')) {
      currentContent.push(line);
    }
  });
  
  if (currentSection && currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n').trim();
  }
  
  return sections;
}

function parseTimelineContent(content: string): any[] {
  const events: any[] = [];
  const sections = content.split('## ').filter(s => s.trim() && !s.startsWith('Timeline'));
  
  sections.forEach(section => {
    const lines = section.trim().split('\n').filter(l => l.trim());
    const firstLine = lines[0];
    
    if (firstLine.includes(':')) {
      const [year, title] = firstLine.split(':').map(s => s.trim());
      const description = lines.slice(1).join('\n\n').trim();
      
      events.push({
        year,
        title,
        description
      });
    }
  });
  
  return events;
}

function parseThatBarContent(content: string): any {
  const sections: any = {};
  const lines = content.split('\n');
  let currentSection = '';
  let currentContent: string[] = [];
  
  lines.forEach(line => {
    if (line.startsWith('## ')) {
      if (currentSection && currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n\n').trim();
      }
      currentSection = line.replace('## ', '').trim();
      currentContent = [];
    } else if (line.trim() && !line.startsWith('#')) {
      currentContent.push(line);
    }
  });
  
  if (currentSection && currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n\n').trim();
  }
  
  return sections;
}

function parsePlotsContent(content: string): Plot[] {
  const plots: Plot[] = [];
  const sections = content.split('## ').filter(s => {
    const trimmed = s.trim();
    return trimmed && !trimmed.startsWith('Plot Guidelines') && !trimmed.startsWith('Plot Hooks');
  });
  
  sections.forEach(section => {
    const lines = section.trim().split('\n').filter(l => l.trim());
    const title = lines[0].trim();
    
    let tag = '';
    let description = '';
    
    // Check if second line is the intensity level (emojis)
    if (lines.length > 1 && (lines[1].includes('🌶️') || lines[1].includes('⚡'))) {
      tag = lines[1].trim();
      // Description is everything after the tag
      description = lines.slice(2).join('\n').trim();
    } else {
      // Fallback: look for old format with ** and |
      lines.forEach(line => {
        if (line.startsWith('**') && line.includes('|')) {
          tag = line.split('**')[1].trim();
          description = line.split('|')[1].trim();
        }
      });
    }
    
    plots.push({
      title,
      tag,
      description
    });
  });
  
  return plots;
}

export function getBioContent(): BioContent {
  const fullPath = path.join(contentDirectory, 'bio.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content } = matter(fileContents);
  
  return parseBioContent(content);
}

export function getTimelineContent(): TimelineEvent[] {
  const fullPath = path.join(contentDirectory, 'timeline.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content } = matter(fileContents);
  
  return parseTimelineContent(content);
}

export function getThatBarContent(): ThatBarContent {
  const fullPath = path.join(contentDirectory, 'that-bar.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content } = matter(fileContents);
  
  return parseThatBarContent(content);
}

export function getPlotsContent(): Plot[] {
  const fullPath = path.join(contentDirectory, 'plots.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content } = matter(fileContents);
  
  return parsePlotsContent(content);
}
