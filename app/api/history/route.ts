import { getHistoryErrorResponse, getStockHistory } from "@/lib/twelve-data";
import { HISTORY_RANGES, type HistoryRange } from "@/lib/stock-types";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const symbol = searchParams.get("symbol")?.trim().toUpperCase();
  const range = searchParams.get("range") ?? "1D";

  if (!symbol || !/^[A-Z0-9.-]{1,10}$/.test(symbol)) {
    return Response.json({ error: "Enter a valid stock symbol." }, { status: 400 });
  }
  if (!HISTORY_RANGES.includes(range as HistoryRange)) {
    return Response.json({ error: "Choose a supported chart range." }, { status: 400 });
  }

  try {
    return Response.json(await getStockHistory(symbol, range as HistoryRange), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return getHistoryErrorResponse(error);
  }
}
