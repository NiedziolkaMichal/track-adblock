import { getActiveUserIds, getMeta, updateMeta } from "../../db/query";
import crypto from "crypto";
import { addUnique } from "../util/collections";

const WORKER_USER_IDS_SECRET_KEY = "ALLOWED_USER_IDS";
const WORKER_USER_IDS_SEPARATOR = ";";
const DATABASE_USER_IDS_CHECKSUM_KEY = "WorkerUserIdsChecksum";

export async function refreshAccessToWorker(includeUserId?: string) {
  const { userIds, currentValueChecksum } = await getUserIdsAndChecksum();
  if (includeUserId) addUnique(userIds, includeUserId);
  const userIdsString = userIds.join(WORKER_USER_IDS_SEPARATOR);

  if (!userIdsUpdated(userIdsString, currentValueChecksum)) {
    return;
  }

  const responsePromise = updateEnvironmentalVariable(WORKER_USER_IDS_SECRET_KEY, userIdsString);
  const checksumPromise = updateChecksum(userIdsString);
  const [response] = await Promise.all([responsePromise, checksumPromise]);
  return response;
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

async function getUserIdsAndChecksum() {
  const userIdsPromise = getActiveUserIds();
  const currentValueChecksumPromise = getMeta(DATABASE_USER_IDS_CHECKSUM_KEY);
  const [userIds, currentValueChecksum] = await Promise.all([userIdsPromise, currentValueChecksumPromise]);

  return {
    userIds: userIds,
    currentValueChecksum: currentValueChecksum?.value || "",
  };
}

function userIdsUpdated(userIds: string, checksum: string) {
  return createUserIdsChecksum(userIds) !== checksum;
}

function createUserIdsChecksum(userIds: string) {
  return crypto.createHash("sha256").update(userIds).digest("hex");
}

function updateChecksum(userIds: string) {
  return updateMeta(DATABASE_USER_IDS_CHECKSUM_KEY, createUserIdsChecksum(userIds));
}
