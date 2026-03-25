
export async function getGithubLanguages(username: string): Promise<string[]> {
  try {
    // Increased to 100 to catch more languages from more repositories
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    
    if (!response.ok) {
        console.warn(`Failed to fetch GitHub repos for ${username}: ${response.statusText}`);
        return [];
    }

    const repos = await response.json();
    const languageMap = new Map<string, number>();

    repos.forEach((repo: any) => {
      if (repo.language) {
        languageMap.set(repo.language, (languageMap.get(repo.language) || 0) + 1);
      }
    });

    // Sort by frequency
    const sortedLanguages = Array.from(languageMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    return sortedLanguages; // Return all languages
  } catch (error) {
    console.error("Error fetching GitHub languages:", error);
    return [];
  }
}

export interface GithubProfileStats {
    public_repos: number;
    followers: number;
    following: number;
    avatar_url: string;
    html_url: string;
    bio: string;
    name: string;
}
  
export async function getGithubProfile(username: string): Promise<GithubProfileStats | null> {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) return null;
      const data = await response.json();
      return {
        public_repos: data.public_repos,
        followers: data.followers,
        following: data.following,
        avatar_url: data.avatar_url,
        html_url: data.html_url,
        bio: data.bio,
        name: data.name
      };
    } catch (error) {
      console.error("Error fetching GitHub profile:", error);
      return null;
    }
}

export function extractUsernameFromUrl(url: string): string | null {
  try {
    // Handle full URL
    if (url.startsWith('http')) {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/').filter(p => p.length > 0);
        return pathParts[0] || null;
    }
    // Handle github.com/username
    if (url.startsWith('github.com/')) {
        return url.split('/')[1] || null;
    }
    // Handle raw username
    return url.trim();
  } catch (e) {
    return null;
  }
}
