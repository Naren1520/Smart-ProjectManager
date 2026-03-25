export interface GithubProfileStats {
  public_repos: number;
  followers: number;
  following: number;
  total_stars?: number; // Not directly available on user endpoint, but we can sum from repos if we want (expensive) or just show basic stats
  avatar_url: string;
  html_url: string;
  bio: string;
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
      bio: data.bio
    };
  } catch (error) {
    console.error("Error fetching GitHub profile:", error);
    return null;
  }
}
