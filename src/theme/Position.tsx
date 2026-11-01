import type { ModuleAssignment, PositionName } from "./contracts";
import { ModuleView } from "./registry";

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

  const Tag = name === "sidebar" ? "aside" : "div";
  const frame = name === "after-header" ? "theme-container pt-4" : "";

  return (
    <Tag data-position={name} className={`slot slot-${name} ${frame}`}>
      {assignments.map((assignment) => (
        <ModuleView key={assignment.id} assignment={assignment} />
      ))}
    </Tag>
  );
}
