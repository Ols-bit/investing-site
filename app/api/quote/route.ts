import { getFinnhubErrorResponse, getStockQuote } from "@/lib/finnhub";

export async function GET(request: Request) {
  const symbol = new URL(request.url).searchParams.get("symbol")?.trim().toUpperCase();
  if (!symbol || !/^[A-Z0-9.-]{1,10}$/.test(symbol)) {
    return Response.json({ error: "Enter a valid stock symbol." }, { status: 400 });
  }

  try {
    return Response.json(await getStockQuote(symbol), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return getFinnhubErrorResponse(error);
  }
}
