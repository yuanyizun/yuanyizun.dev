import { Suspense, ViewTransition } from "react";
import { ArchitectureFigure } from "@/components/composite/architecture-figure/architecture-figure";
import { ArticleCover } from "@/components/composite/article-cover/article-cover";
import { ArticleHeader } from "@/components/composite/article-header/article-header";
import { AuthorBio } from "@/components/composite/author-bio/author-bio";
import { Breadcrumbs } from "@/components/composite/breadcrumbs/breadcrumbs";
import { CaseStudyHeader } from "@/components/composite/case-study-header/case-study-header";
import { ContactCTA } from "@/components/composite/contact-cta/contact-cta";
import { IntroHero } from "@/components/composite/intro-hero/intro-hero";
import { PageIntro } from "@/components/composite/page-intro/page-intro";
import { ProofPoints } from "@/components/composite/proof-points/proof-points";
import { RelatedList } from "@/components/composite/related-list/related-list";
import { SectionNav } from "@/components/composite/section-nav/section-nav";
import { SiteFooter } from "@/components/composite/site-footer/site-footer";
import {
  HeaderAccount,
  HeaderSignIn,
} from "@/components/composite/site-header/header-account";
import { SiteHeader } from "@/components/composite/site-header/site-header";
import type { ModuleAssignment } from "@/theme/contracts";

function HeaderAccountSlot({ className }: { className?: string }) {
  return (
    <Suspense
      fallback={
        <ViewTransition exit="header-account-exit" default="none">
          <HeaderSignIn className={className} />
        </ViewTransition>
      }
    >
      <ViewTransition enter="header-account-enter" default="none">
        <HeaderAccount className={className} />
      </ViewTransition>
    </Suspense>
  );
}

export function ModuleView({ assignment }: { assignment: ModuleAssignment }) {
  switch (assignment.type) {
    case "SiteHeader":
      return (
        <SiteHeader
          {...assignment.props}
          accountDesktop={<HeaderAccountSlot />}
          accountMobile={<HeaderAccountSlot className="w-fit" />}
        />
      );
    case "SiteFooter":
      return <SiteFooter />;
    case "IntroHero":
      return <IntroHero {...assignment.props} />;
    case "ProofPoints":
      return <ProofPoints />;
    case "PageIntro":
      return <PageIntro {...assignment.props} />;
    case "ResumeLink":
      return (
        <p>
          <a href={assignment.props.href}>{assignment.props.label}</a>
        </p>
      );
    case "Breadcrumbs":
      return <Breadcrumbs {...assignment.props} />;
    case "ArticleHeader":
      return <ArticleHeader {...assignment.props} />;
    case "ArticleCover":
      return <ArticleCover {...assignment.props} />;
    case "ArticleNavigation":
      return <SectionNav {...assignment.props} label={assignment.props.label ?? "Contents"} />;
    case "AuthorBio":
      return <AuthorBio />;
    case "RelatedPosts":
      return <RelatedList title="Related notes" items={assignment.props.items} />;
    case "CaseStudyHeader":
      return <CaseStudyHeader {...assignment.props} />;
    case "ArchitectureFigure":
      return <ArchitectureFigure {...assignment.props} />;
    case "CaseStudyNavigation":
      return (
        <SectionNav
          {...assignment.props}
          label={assignment.props.label ?? "On this page"}
        />
      );
    case "RelatedProjects":
      return <RelatedList title="Related work" items={assignment.props.items} />;
    case "ContactCTA":
      return <ContactCTA {...assignment.props} />;
    default: {
      const unreachable: never = assignment;
      return unreachable;
    }
  }
}
