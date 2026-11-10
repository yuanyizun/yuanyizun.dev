import raw from "@/configs/tech-globe.json";

export type TechGlobeCategory =
  | "backend"
  | "laravel"
  | "frontend"
  | "python"
  | "cloud"
  | "crm"
  | "workflow";

export type TechGlobeNode = {
  id: string;
  label: string;
  category: TechGlobeCategory;
  detail: string;
  /** World-space position in the network map. */
  position: [number, number, number];
};

export type TechGlobeEdge = {
  from: string;
  to: string;
};

export type TechGlobeContent = {
  defaultSelectedId: string;
  categories: Record<TechGlobeCategory, string>;
  nodes: TechGlobeNode[];
  edges: TechGlobeEdge[];
};

const TECH_GLOBE_CATEGORY_KEYS = [
  "backend",
  "laravel",
  "frontend",
  "python",
  "cloud",
  "crm",
  "workflow",
] as const satisfies readonly TechGlobeCategory[];

function isTechGlobeCategory(value: unknown): value is TechGlobeCategory {
  return (
    typeof value === "string" &&
    (TECH_GLOBE_CATEGORY_KEYS as readonly string[]).includes(value)
  );
}

function isPosition(value: unknown): value is [number, number, number] {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every((coordinate) => typeof coordinate === "number" && Number.isFinite(coordinate))
  );
}

function isTechGlobeNode(value: unknown): value is TechGlobeNode {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    entry.id.length > 0 &&
    typeof entry.label === "string" &&
    entry.label.length > 0 &&
    isTechGlobeCategory(entry.category) &&
    typeof entry.detail === "string" &&
    entry.detail.length > 0 &&
    isPosition(entry.position)
  );
}

function isTechGlobeEdge(value: unknown): value is TechGlobeEdge {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.from === "string" &&
    entry.from.length > 0 &&
    typeof entry.to === "string" &&
    entry.to.length > 0
  );
}

function loadTechGlobe(data: unknown): TechGlobeContent {
  if (typeof data !== "object" || data === null) {
    throw new Error("tech-globe.json must be an object");
  }

  const record = data as Record<string, unknown>;

  if (
    typeof record.defaultSelectedId !== "string" ||
    record.defaultSelectedId.length === 0
  ) {
    throw new Error('tech-globe.json must define a non-empty "defaultSelectedId"');
  }

  if (typeof record.categories !== "object" || record.categories === null) {
    throw new Error('tech-globe.json must define a "categories" object');
  }

  const categoriesRaw = record.categories as Record<string, unknown>;
  const categories = {} as Record<TechGlobeCategory, string>;
  for (const key of TECH_GLOBE_CATEGORY_KEYS) {
    const label = categoriesRaw[key];
    if (typeof label !== "string" || label.length === 0) {
      throw new Error(
        `tech-globe.json "categories" must include a non-empty string for "${key}"`,
      );
    }
    categories[key] = label;
  }

  if (!Array.isArray(record.nodes) || record.nodes.length === 0) {
    throw new Error('tech-globe.json must define a non-empty "nodes" array');
  }

  if (!record.nodes.every(isTechGlobeNode)) {
    throw new Error(
      'tech-globe.json "nodes" must be objects with id, label, category, detail, and position [x, y, z]',
    );
  }

  const nodes = record.nodes as TechGlobeNode[];
  const nodeIds = new Set(nodes.map((node) => node.id));
  if (nodeIds.size !== nodes.length) {
    throw new Error('tech-globe.json "nodes" must have unique ids');
  }

  if (!nodeIds.has(record.defaultSelectedId)) {
    throw new Error(
      `tech-globe.json "defaultSelectedId" "${record.defaultSelectedId}" must match a node id`,
    );
  }

  if (!Array.isArray(record.edges) || record.edges.length === 0) {
    throw new Error('tech-globe.json must define a non-empty "edges" array');
  }

  if (!record.edges.every(isTechGlobeEdge)) {
    throw new Error(
      'tech-globe.json "edges" must be objects with non-empty "from" and "to" strings',
    );
  }

  const edges = record.edges as TechGlobeEdge[];
  for (const edge of edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      throw new Error(
        `tech-globe.json edge "${edge.from}" -> "${edge.to}" must reference known node ids`,
      );
    }
  }

  return {
    defaultSelectedId: record.defaultSelectedId,
    categories,
    nodes,
    edges,
  };
}

const TECH_GLOBE = loadTechGlobe(raw);

/** Default selected node when the hero graph first loads. */
export const TECH_GLOBE_DEFAULT_SELECTED_ID = TECH_GLOBE.defaultSelectedId;

export const TECH_GLOBE_CATEGORIES = TECH_GLOBE.categories;

/** Curated resume stack — copy stays within about/resume facts. */
export const TECH_GLOBE_NODES = TECH_GLOBE.nodes;

/** Edges mirror real stack relationships from the resume/about copy. */
export const TECH_GLOBE_EDGES = TECH_GLOBE.edges;

export function techGlobeNodeMap() {
  return new Map(TECH_GLOBE_NODES.map((node) => [node.id, node]));
}
