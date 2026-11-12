import { interviewAppIcon } from "@/components/composite/interview-app/interview-app-icons";

const allowed = new Set(["192", "512"]);

export async function GET(
  _request: Request,
  context: { params: Promise<{ size: string }> },
) {
  const { size } = await context.params;
  if (!allowed.has(size)) {
    return new Response("Not found", { status: 404 });
  }

  return interviewAppIcon(Number(size));
}
