import { Container } from "@/components/primitive/container/container";
import type { PlacementEntry, PositionName } from "@/theme/contracts";
import { readPlacementEntry } from "@/theme/contracts";
import type { PlacementProps } from "@/theme/registry";
import { themeRegistry } from "@/theme/registry";

function propsFor(props: PlacementProps | undefined, id: string): Record<string, unknown> {
  if (!props || !(id in props)) {
    return {};
  }
  const value = props[id as keyof PlacementProps];
  if (!value) {
    return {};
  }
  return value as Record<string, unknown>;
}

export function Position({
  name,
  entries,
  props,
}: {
  name: PositionName;
  entries: PlacementEntry[];
  props?: PlacementProps;
}) {
  if (entries.length === 0) {
    return null;
  }

  const items = entries.map((entry) => {
    const parsed = readPlacementEntry(entry);
    if (!parsed) {
      throw new Error(`Invalid placement entry in "${name}"`);
    }

    const spec = themeRegistry[parsed.component as keyof typeof themeRegistry];
    if (!spec) {
      throw new Error(`Unknown component "${parsed.component}"`);
    }

    const entryProps = propsFor(props, parsed.id);
    for (const key of spec.required) {
      if (entryProps[key] === undefined) {
        throw new Error(`Missing required prop "${key}" for "${parsed.id}"`);
      }
    }

    const View = spec.component;
    return <View key={parsed.id} {...entryProps} />;
  });

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
