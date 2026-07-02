import { PROJECT_DATABASE } from "./database";

interface InputData {
  skills: string[];
  interests: string[];
  publications: { title: string }[];
}

interface ProjectSuggestion {
  title: string;
  description: string;
  tags: string[];
  matchScore: number;
  relevantSkills: string[];
  researchAreas: string[];
}

export function suggestProjects(input: InputData): ProjectSuggestion[] {
  const { skills, interests, publications } = input;
  const textCorpus = [...skills, ...interests, ...publications.map(p => p.title)].join(" ").toLowerCase();

  return PROJECT_DATABASE
    .map(project => {
      const skillMatch = skills.filter(skill =>
        project.tags.some(tag => tag.toLowerCase().includes(skill.toLowerCase()))
      );

      const interestMatch = interests.filter(interest =>
        project.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
      );

      const pubKeywordMatch = publications.filter(pub =>
        project.tags.some(tag => pub.title.toLowerCase().includes(tag.toLowerCase()))
      );

      const matchScore = (skillMatch.length * 4) + (interestMatch.length * 3) + (pubKeywordMatch.length * 2);

      return {
        ...project,
        matchScore,
        relevantSkills: skillMatch,
        researchAreas: interestMatch
      };
    })
    .filter(p => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}
