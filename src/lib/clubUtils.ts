/**
 * Club Utilities
 * Funções utilitárias para normalização e manipulação de nomes de clubes/programas
 */

/**
 * Remove prefixos de clube do nome do programa
 * Remove "Clube de", "Clube dos", "Clube das", "Clube do", "Clube da" (case insensitive)
 * 
 * @param programName - Nome do programa original
 * @returns Nome do programa sem o prefixo de clube
 * 
 * @example
 * removeClubPrefix('CLUBE DAS STARTUPS ANGOLANAS') // 'STARTUPS ANGOLANAS'
 * removeClubPrefix('Clube dos Empreendedores') // 'Empreendedores'
 * removeClubPrefix('STARTUPS ANGOLANAS') // 'STARTUPS ANGOLANAS'
 */
export function removeClubPrefix(programName: string): string {
  if (!programName) return '';
  
  const prefixes = [
    'CLUBE DE ',
    'CLUBE DOS ',
    'CLUBE DAS ',
    'CLUBE DO ',
    'CLUBE DA ',
    'Clube de ',
    'Clube dos ',
    'Clube das ',
    'Clube do ',
    'Clube da ',
    'CLUBE',
    'Clube'
  ];
  
  let cleanName = programName.trim();
  
  for (const prefix of prefixes) {
    if (cleanName.toUpperCase().startsWith(prefix.toUpperCase())) {
      cleanName = cleanName.substring(prefix.length).trim();
      break;
    }
  }
  
  return cleanName;
}

/**
 * Gera o título dinâmico da etapa de clube com base no nome do programa
 * Formato: "Clube de: [Nome do Programa sem prefixo]"
 * 
 * @param programName - Nome do programa original
 * @returns Título formatado para a etapa de clube
 * 
 * @example
 * getClubStepTitle('CLUBE DAS STARTUPS ANGOLANAS') // 'Clube de: Startups Angolanas'
 * getClubStepTitle('Clube dos Empreendedores') // 'Clube de: Empreendedores'
 * getClubStepTitle('STARTUPS ANGOLANAS') // 'Clube de: Startups Angolanas'
 */
export function getClubStepTitle(programName: string): string {
  const cleanName = removeClubPrefix(programName);
  return `Clube de: ${cleanName}`;
}

/**
 * Capitaliza a primeira letra de cada palavra no nome
 * 
 * @param text - Texto para capitalizar
 * @returns Texto capitalizado
 */
export function capitalizeWords(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}