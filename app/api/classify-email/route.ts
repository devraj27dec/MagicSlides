import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { emailText } = await req.json();

     const prompt = `
        Classify this email into one of the following categories:

        Important: Emails that are personal or work-related and require immediate attention.
        Promotions: Emails related to sales, discounts, and marketing campaigns.
        Social: Emails from social networks, friends, and family.
        Marketing: Emails related to marketing, newsletters, and notifications.
        Spam: Unwanted or unsolicited emails.
        General: If none of the above are matched, use General.

        Email content:
        """
        ${emailText}
        """

        Return only the category name exactly as listed above.
        `;
    // Call Gemini API directly
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      return NextResponse.json({ error: "Gemini API error" }, { status: 500 });
    }

    const data = await response.json();

    // Extract category text from Gemini response
    const category =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "General";

    return NextResponse.json({ category });
  } catch (err: any) {
    console.error("Classification error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to classify email" },
      { status: 500 }
    );
  }
}
