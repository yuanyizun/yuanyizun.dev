import "server-only";

import { createElement, type ComponentType } from "react";
import { ArchitectureFigure } from "@/components/composite/architecture-figure/architecture-figure";
import { ArticleCover } from "@/components/composite/article-cover/article-cover";
import {
  ArticleHeader,
  type ArticleMeta,
} from "@/components/composite/article-header/article-header";
import { AuthorBio } from "@/components/composite/author-bio/author-bio";
import { Breadcrumbs, type Crumb } from "@/components/composite/breadcrumbs/breadcrumbs";
import {
  CaseStudyHeader,
  type CaseStudyMeta,
} from "@/components/composite/case-study-header/case-study-header";
import { ContactCTA } from "@/components/composite/contact-cta/contact-cta";
import { IntroHero } from "@/components/composite/intro-hero/intro-hero";
import { NosyPointer } from "@/components/composite/nosy-pointer/nosy-pointer";
import { PageIntro } from "@/components/composite/page-intro/page-intro";
import { ProfileChat } from "@/components/composite/profile-chat/profile-chat";
import { ProofPoints } from "@/components/composite/proof-points/proof-points";
import { RelatedList, type RelatedItem } from "@/components/composite/related-list/related-list";
import { SectionNav } from "@/components/composite/section-nav/section-nav";
import { SiteFooter } from "@/components/composite/site-footer/site-footer";
import { HeaderAccountSection } from "@/components/composite/site-header/header-account";
import { SiteHeader, type NavKey } from "@/components/composite/site-header/site-header";
import type { AllowedPositions, PositionName } from "@/theme/contracts";
import type { HeadingLink } from "@/utils/markdown";

type PlacedComponent = ComponentType<Record<string, unknown>>;

export type RegistryEntry = {
  component: PlacedComponent;
  positions: readonly PositionName[];
  required: readonly string[];
};

function placed<P extends object>(component: ComponentType<P>): PlacedComponent {
  return component as PlacedComponent;
}

function SiteHeaderPlacement({ active }: { active?: NavKey }) {
  return createElement(SiteHeader, {
    active,
    accountDesktop: createElement(HeaderAccountSection),
    accountMobile: createElement(HeaderAccountSection, { className: "w-fit" }),
  });
}

export const themeRegistry = {
  NosyPointer: { component: placed(NosyPointer), positions: ["before-header"], required: [] },
  SiteHeader: { component: placed(SiteHeaderPlacement), positions: ["header"], required: [] },
  ContactCTA: {
    component: placed(ContactCTA),
    positions: ["main-after", "before-footer"],
    required: [],
  },
  SiteFooter: { component: placed(SiteFooter), positions: ["footer"], required: [] },
  ProfileChat: { component: placed(ProfileChat), positions: ["after-footer"], required: [] },
  IntroHero: {
    component: placed(IntroHero),
    positions: ["main-before"],
    required: ["title", "summary"],
  },
  ProofPoints: { component: placed(ProofPoints), positions: ["main-middle"], required: [] },
  PageIntro: { component: placed(PageIntro), positions: ["main-before"], required: ["title"] },
  Breadcrumbs: { component: placed(Breadcrumbs), positions: ["after-header"], required: ["items"] },
  ArticleHeader: {
    component: placed(ArticleHeader),
    positions: ["main-before"],
    required: ["article"],
  },
  ArticleCover: {
    component: placed(ArticleCover),
    positions: ["main-middle"],
    required: ["alt", "image"],
  },
  SectionNav: { component: placed(SectionNav), positions: ["sidebar"], required: ["headings"] },
  AuthorBio: { component: placed(AuthorBio), positions: ["main-after"], required: [] },
  RelatedList: {
    component: placed(RelatedList),
    positions: ["main-after"],
    required: ["title", "items"],
  },
  CaseStudyHeader: {
    component: placed(CaseStudyHeader),
    positions: ["main-before"],
    required: ["study"],
  },
  ArchitectureFigure: {
    component: placed(ArchitectureFigure),
    positions: ["main-middle"],
    required: ["stages", "title"],
  },
} satisfies Record<string, RegistryEntry>;

export const themeAllowed: AllowedPositions = Object.fromEntries(
  Object.entries(themeRegistry).map(([name, entry]) => [name, entry.positions]),
);

export type PlacementProps = {
  IntroHero?: { title: string; summary: string };
  PageIntro?: { title: string; summary?: string; mark?: "profile" };
  Breadcrumbs?: { items: Crumb[] };
  ArticleHeader?: { article: ArticleMeta };
  ArticleCover?: { alt: string; image: string; credit?: string };
  SectionNav?: { headings: HeadingLink[]; label?: string };
  CaseStudyHeader?: { study: CaseStudyMeta };
  ArchitectureFigure?: { stages: string[]; title: string };
  RelatedList?: { title: string; items: RelatedItem[] };
  ContactCTA?: { variant?: "compact" | "full" };
  SiteHeader?: { active?: NavKey };
};
