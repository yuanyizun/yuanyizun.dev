import "server-only";
import { getSelectedWork } from "@/services/selected-work";
import { SelectedWork } from "./selected-work";

export async function SelectedWorkSection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const selected = await getSelectedWork(params);
  return <SelectedWork projects={selected.projects} facets={selected.facets} />;
}
