// A map of canonical language names to their common tag aliases (all lowercase)
const LANGUAGE_MAP: Record<string, string[]> = {
  JavaScript: ['javascript', 'js', 'es6', 'ecmascript', 'node', 'nodejs', 'react', 'vue', 'angular'],
  TypeScript: ['typescript', 'ts'],
  Python: ['python', 'py', 'django', 'flask'],
  Java: ['java', 'spring'],
  Go: ['golang', 'go'],
  Rust: ['rust'],
  'C#': ['csharp', 'c#', '.net'],
  'C++': ['c++', 'cpp'],
  PHP: ['php', 'laravel', 'symfony'],
  Ruby: ['ruby', 'rails'],
  Swift: ['swift', 'ios'],
  Kotlin: ['kotlin', 'android'],
  HTML: ['html', 'html5'],
  CSS: ['css', 'css3', 'scss', 'sass', 'tailwind'],
  SQL: ['sql', 'mysql', 'postgres', 'postgresql'],
  Shell: ['shell', 'bash', 'sh', 'zsh'],
  Dart: ['dart', 'flutter'],
};

// Create a reverse map for efficient lookups: tag -> canonical language
const TAG_TO_LANGUAGE_MAP = new Map<string, string>();
for (const language in LANGUAGE_MAP) {
  LANGUAGE_MAP[language].forEach(tag => {
    TAG_TO_LANGUAGE_MAP.set(tag, language);
  });
}

/**
 * Takes a tag and returns its canonical programming language name if it's a known language alias.
 * @param tag The tag string to check.
 * @returns The canonical language name (e.g., "JavaScript") or null.
 */
export const getLanguageFromTag = (tag: string): string | null => {
  return TAG_TO_LANGUAGE_MAP.get(tag.toLowerCase().trim()) || null;
};
