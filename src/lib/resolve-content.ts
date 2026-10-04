import { defaultSettings, starterProjects } from './starter-content';
import { isCategory, type Project, type Settings } from './types';

export function resolvePortfolio(result: { settings: Partial<Settings> | null; projects: Project[] }) {
  const settings = { ...defaultSettings };
  for (const key of Object.keys(defaultSettings) as (keyof Settings)[]) {
    const value = result.settings?.[key];
    if (value !== null && value !== undefined) Object.assign(settings, { [key]: value });
  }
  if (result.settings?.heroModelUrl) settings.heroModelUrl = result.settings.heroModelUrl;
  if (result.settings?.heroPoster) settings.heroPoster = result.settings.heroPoster;
  const projects = result.projects.filter(project => isCategory(project.category) && project.title && project.slug && project.cover);
  return { settings, projects: projects.length || result.settings ? projects : starterProjects };
}
