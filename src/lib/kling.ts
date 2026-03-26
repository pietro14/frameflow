import jwt from "jsonwebtoken";

const KLING_BASE_URL = "https://api.klingai.com";

function generateToken(): string {
  const accessKey = process.env.KLING_ACCESS_KEY!;
  const secretKey = process.env.KLING_SECRET_KEY!;
  const now = Math.floor(Date.now() / 1000);

  return jwt.sign(
    {
      iss: accessKey,
      exp: now + 1800,
      nbf: now - 5,
    },
    secretKey,
    {
      algorithm: "HS256",
      header: { alg: "HS256", typ: "JWT" },
    }
  );
}

function getHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${generateToken()}`,
    "Content-Type": "application/json",
  };
}

export async function createVideoTask(
  startImageBase64: string,
  endImageBase64: string,
  prompt: string
): Promise<string> {
  const body = {
    model_name: "kling-v1-6",
    mode: "pro",
    duration: "5",
    image: startImageBase64,
    image_tail: endImageBase64,
    prompt,
    negative_prompt:
      "blurry, distorted, CGI, text overlay, watermark, low quality",
    cfg_scale: 0.5,
  };

  const resp = await fetch(`${KLING_BASE_URL}/v1/videos/image2video`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  const data = await resp.json();
  if (data.code !== 0) {
    throw new Error(`Kling API error ${data.code}: ${data.message}`);
  }

  return data.data.task_id;
}

export async function getTaskStatus(
  taskId: string
): Promise<{ status: string; videoUrl?: string }> {
  const resp = await fetch(
    `${KLING_BASE_URL}/v1/videos/image2video/${taskId}`,
    { headers: getHeaders() }
  );

  const data = await resp.json();
  const taskData = data.data;

  let videoUrl: string | undefined;
  if (taskData.task_status === "succeed") {
    videoUrl = taskData.task_result?.videos?.[0]?.url;
  }

  return { status: taskData.task_status, videoUrl };
}
