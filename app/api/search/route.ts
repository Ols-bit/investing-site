import { getFinnhubErrorResponse, searchStocks } from "@/lib/finnhub";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query) {
    return Response.json([]);
  }
  if (query.length > 50) {
    return Response.json({ error: "Search text must be 50 characters or fewer." }, { status: 400 });
  }

  try {
    return Response.json(await searchStocks(query), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return getFinnhubErrorResponse(error);
  }
}
