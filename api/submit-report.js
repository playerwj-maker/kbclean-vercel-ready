// api/submit-report.js
// KB클린 현장보고 → Google Apps Script 전달용 Vercel API
// 예전 Apps Script URL로 몰래 보내는 fallback을 제거한 안전 버전입니다.
// GAS_WEBAPP_URL 환경변수가 없으면 바로 오류를 반환합니다.

export default async function handler(req, res) {
  const gasUrl = process.env.GAS_WEBAPP_URL;

  // 브라우저에서 /api/submit-report 주소를 직접 열면 연결 상태 확인 가능
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      endpoint: "kbclean submit-report",
      hasGasUrl: Boolean(gasUrl),
      gasUrlPreview: gasUrl
        ? `${gasUrl.slice(0, 45)}...${gasUrl.slice(-12)}`
        : null,
      message: gasUrl
        ? "GAS_WEBAPP_URL is set. POST submissions will be forwarded to Apps Script."
        : "GAS_WEBAPP_URL is missing. Add it in Vercel Environment Variables and Redeploy.",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "METHOD_NOT_ALLOWED",
      message: "Use POST to submit reports.",
    });
  }

  if (!gasUrl) {
    return res.status(500).json({
      ok: false,
      error: "MISSING_GAS_WEBAPP_URL",
      message:
        "Vercel 환경변수 GAS_WEBAPP_URL이 없습니다. Vercel Settings → Environment Variables에 Apps Script Web App URL을 넣고 Redeploy 하세요.",
    });
  }

  try {
    const payload = req.body || {};

    const gasResponse = await fetch(gasUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    const text = await gasResponse.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      data = {
        ok: false,
        error: "GAS_NON_JSON_RESPONSE",
        status: gasResponse.status,
        raw: text.slice(0, 1000),
      };
    }

    return res.status(gasResponse.ok ? 200 : gasResponse.status).json({
      ok: Boolean(data.ok),
      forwardedToGas: true,
      gasStatus: gasResponse.status,
      gasResult: data,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "SUBMIT_REPORT_FAILED",
      message: error?.message || String(error),
    });
  }
}
