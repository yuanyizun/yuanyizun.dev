import { Container } from "@/components/primitive/container/container";
import { ModuleView } from "@/components/composite/module-view/module-view";
import type { ModuleAssignment, PositionName } from "@/theme/contracts";

export function Position({
  name,
  assignments,
}: {
  name: PositionName;
  assignments: ModuleAssignment[];
}) {
  if (assignments.length === 0) {
    return null;
  }

  const items = assignments.map((assignment) => (
    <ModuleView key={assignment.id} assignment={assignment} />
  ));

  if (name === "after-header") {
    return (
      <Container as="div" data-position={name} className="pt-4">
        {items}
      </Container>
    );
  }

  const Tag = name === "sidebar" ? "aside" : "div";
  return <Tag data-position={name}>{items}</Tag>;
}
