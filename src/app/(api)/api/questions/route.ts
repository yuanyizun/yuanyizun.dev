import { getQuestions } from "@/data/questions";
import { toPublicNotes } from "@/data/internal/questions-public";

const cacheControl = "public, max-age=3600, stale-while-revalidate=86400";

export async function GET() {
  const notes = toPublicNotes(await getQuestions());
  return Response.json(
    { notes },
    {
      headers: {
        "Cache-Control": cacheControl,
      },
    },
  );
}
