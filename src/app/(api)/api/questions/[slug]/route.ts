import { getQuestions } from "@/data/questions";
import { findPublicNote } from "@/data/internal/questions-public";

const cacheControl = "public, max-age=3600, stale-while-revalidate=86400";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const note = findPublicNote(await getQuestions(), slug);
  if (!note) {
    return Response.json(
      { error: "Not found" },
      {
        status: 404,
        headers: {
          "Cache-Control": cacheControl,
        },
      },
    );
  }

  return Response.json(
    { note },
    {
      headers: {
        "Cache-Control": cacheControl,
      },
    },
  );
}
