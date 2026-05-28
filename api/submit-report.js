export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "POST 요청만 허용됩니다." });
  }

  const gasUrl = process.env.GAS_WEBAPP_URL;
  if (!gasUrl) {
    return res.status(500).json({
      ok: false,
      message: "Vercel 환경변수 GAS_WEBAPP_URL이 설정되지 않았습니다.",
    });
  }

  try {
    const gasResponse = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(req.body || {}),
    });

    const text = await gasResponse.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (error) {
      data = { ok: false, message: text || "Apps Script 응답을 해석하지 못했습니다." };
    }

    if (!gasResponse.ok || data.ok === false) {
      return res.status(500).json({
        ok: false,
        message: data.message || "Apps Script 처리에 실패했습니다.",
        raw: data,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message || "서버 전송 중 오류가 발생했습니다.",
    });
  }
}
