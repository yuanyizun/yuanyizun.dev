import type { FrameVariant, Placement, TemplateKey } from "../contracts";

export const templatePlacements: Record<TemplateKey, Placement> = {
  home: {
    "main-before": [
      {
        id: "home-intro",
        type: "IntroHero",
        props: {
          title: "Senior full stack & platform engineer.",
          summary:
            "11 years delivering publishing platforms, business applications, integrations, and cloud infrastructure.",
        },
      },
    ],
    "main-middle": [{ id: "home-proof", type: "ProofPoints", props: {} }],
    sidebar: [],
  },
  about: {
    "main-before": [
      {
        id: "about-intro",
        type: "PageIntro",
        props: {
          title: "Full-stack ownership. Systems that last.",
          summary:
            "Full stack engineer with 11 years delivering and maintaining production applications for a digital media business.",
          mark: "profile",
        },
      },
    ],
    sidebar: [],
  },
  posts: {
    "main-before": [
      {
        id: "posts-intro",
        type: "PageIntro",
        props: {
          title: "Engineering Notes & Articles",
          summary:
            "Practical write-ups on building production systems, solving backend challenges, and working with modern web stacks.",
        },
      },
    ],
    sidebar: [],
  },
  post: {
    "after-header": [
      {
        id: "post-breadcrumbs",
        type: "Breadcrumbs",
        props: { items: [{ label: "Posts", href: "/posts" }] },
      },
    ],
    sidebar: [],
    "main-after": [{ id: "post-author", type: "AuthorBio", props: {} }],
  },
  projects: {
    "main-before": [
      {
        id: "projects-intro",
        type: "PageIntro",
        props: {
          title: "Production systems. Practical outcomes.",
          summary:
            "Selected systems from eleven years at one digital publisher, plus one personal project.",
        },
      },
    ],
    sidebar: [],
  },
  project: {
    "after-header": [
      {
        id: "project-breadcrumbs",
        type: "Breadcrumbs",
        props: { items: [{ label: "Projects", href: "/projects" }] },
      },
    ],
    sidebar: [],
  },
  contact: {
    "main-before": [
      {
        id: "contact-intro",
        type: "PageIntro",
        props: {
          title: "Contact",
          summary:
            "Write or call about production systems, platforms, and full stack work. Sydney, NSW, Australia.",
        },
      },
    ],
    sidebar: [],
  },
  auth: { sidebar: [] },
  "not-found": { sidebar: [] },
  error: { sidebar: [] },
};

export const templateVariants: Record<TemplateKey, FrameVariant> = {
  home: "wide",
  about: "wide",
  posts: "wide",
  post: "reading",
  projects: "wide",
  project: "reading",
  contact: "compact",
  auth: "compact",
  "not-found": "compact",
  error: "compact",
};
