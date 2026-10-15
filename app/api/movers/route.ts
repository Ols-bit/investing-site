import { getFinnhubErrorResponse } from "@/lib/finnhub";
import { getMarketMovers } from "@/lib/movers";

export async function GET() {
  try {
    return Response.json(await getMarketMovers(), {
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return getFinnhubErrorResponse(error);
  }
}
