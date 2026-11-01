import raw from "../../content/social-links.json";

export type SocialLink = {
  id: string;
  label: string;
  href: string;
};

export type SocialLinksContent = {
  links: SocialLink[];
};

function isSocialLink(value: unknown): value is SocialLink {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    entry.id.length > 0 &&
    typeof entry.label === "string" &&
    entry.label.length > 0 &&
    typeof entry.href === "string" &&
    entry.href.startsWith("https://")
  );
}

function loadSocialLinks(data: unknown): SocialLinksContent {
  if (
    typeof data !== "object" ||
    data === null ||
    !("links" in data) ||
    !Array.isArray((data as { links: unknown }).links)
  ) {
    throw new Error('social-links.json must define a non-empty "links" array');
  }

  const links = (data as { links: unknown[] }).links;
  if (links.length === 0 || !links.every(isSocialLink)) {
    throw new Error(
      'social-links.json "links" must be a non-empty array of { id, label, href } with https hrefs',
    );
  }

  return { links };
}

export const SOCIAL_LINKS = loadSocialLinks(raw).links;
