import { getActiveUserIds } from "../../db/query";
import { uniqueArray } from "../util/collections";

const WORKER_USER_IDS_SECRET_KEY = "ALLOWED_USER_IDS";
const WORKER_USER_IDS_SEPARATOR = ";";

export async function addAccessToWorker(...userIds: string[]) {
  const currentUserIds = await getActiveUserIds();
  const allUserIds = uniqueArray(...currentUserIds, ...userIds);

  return refreshAccessToWorker(allUserIds);
}

export async function removeAccessToWorker(...userIds: string[]) {
  const currentUserIds = await getActiveUserIds();
  const allUserIds = currentUserIds.filter((id) => !userIds.includes(id));

  return refreshAccessToWorker(allUserIds);
}

function refreshAccessToWorker(userIds: string[]) {
  const joinedIds = userIds.join(WORKER_USER_IDS_SEPARATOR);
  return updateEnvironmentalVariable(WORKER_USER_IDS_SECRET_KEY, joinedIds);
}

async function updateEnvironmentalVariable(key: string, value: string) {
  const body = {
    name: key,
    text: value,
  };
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_WORKER_ACCOUNT_ID}/workers/scripts/${process.env.CLOUDFLARE_WORKER_ID}/secrets`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_WORKER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response.json();
}
