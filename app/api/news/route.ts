import {
  getCompanyNews,
  getFinnhubErrorResponse,
  getMarketNews,
} from "@/lib/finnhub";
import type { MarketNewsCategory } from "@/lib/stock-types";

const categories = new Set<MarketNewsCategory>(["general", "forex", "crypto", "merger"]);

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const symbol = searchParams.get("symbol")?.trim().toUpperCase();
  if (symbol) {
    if (!/^[A-Z0-9.-]{1,10}$/.test(symbol)) {
      return Response.json({ error: "Enter a valid stock symbol." }, { status: 400 });
    }
    try {
      return Response.json(await getCompanyNews(symbol), {
        headers: { "Cache-Control": "no-store" },
      });
    } catch (error) {
      return getFinnhubErrorResponse(error);
    }
  }

  const requestedCategory = searchParams.get("category") ?? "general";
  if (!categories.has(requestedCategory as MarketNewsCategory)) {
    return Response.json({ error: "Choose a supported news category." }, { status: 400 });
  }

  try {
    return Response.json(await getMarketNews(requestedCategory as MarketNewsCategory), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return getFinnhubErrorResponse(error);
  }
}
