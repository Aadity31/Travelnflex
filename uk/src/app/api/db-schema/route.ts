import { NextResponse } from "next/server";
import { getFullSchema, getSchemaAsSQL } from "@/lib/db/schema";

export async function GET() {
  try {
    const [schema, sql] = await Promise.all([
      getFullSchema(),
      getSchemaAsSQL(),
    ]);

    return NextResponse.json({
      success: true,
      schema,
      sql,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching schema:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch database schema" },
      { status: 500 }
    );
  }
}
