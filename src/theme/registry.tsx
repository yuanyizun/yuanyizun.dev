import { ArchitectureFigure } from "@/modules/architecture-figure";
import { ArticleCover } from "@/modules/article-cover";
import { ArticleHeader } from "@/modules/article-header";
import { AuthorBio } from "@/modules/author-bio";
import { Breadcrumbs } from "@/modules/breadcrumbs";
import { CaseStudyHeader } from "@/modules/case-study-header";
import { ContactCTA } from "@/modules/contact-cta";
import { IntroHero } from "@/modules/intro-hero";
import { PageIntro } from "@/modules/page-intro";
import { ProofPoints } from "@/modules/proof-points";
import { RelatedList } from "@/modules/related-list";
import { SectionNav } from "@/modules/section-nav";
import { SiteFooter } from "@/modules/site-footer";
import { SiteHeader } from "@/modules/site-header";
import type { ModuleAssignment } from "./contracts";

export function ModuleView({ assignment }: { assignment: ModuleAssignment }) {
  switch (assignment.type) {
    case "SiteHeader":
      return <SiteHeader {...assignment.props} />;
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
