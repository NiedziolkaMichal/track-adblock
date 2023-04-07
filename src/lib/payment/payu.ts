import { GetServerSidePropsContext } from "next/types";
import { fullEncodeUriComponent } from "../util/uri";
import crypto from "crypto";
import { ProductPrice } from "./prices";
import requestIp from "request-ip";

export type PaymentFields = Record<string, string | number>;

export function getPaymentFields(email: string, productPrice: ProductPrice, context: GetServerSidePropsContext): PaymentFields {
  const clientIp = requestIp.getClientIp(context.req);

  if (!clientIp) {
    throw new TypeError("Couldn't find users IP");
  }
  if (!process.env.PAYU_POS_ID || !process.env.PAYU_SECOND_KEY) {
    throw new TypeError("Environmental Variables for PayU were not set");
  }

  const fields: PaymentFields = {
    "buyer.email": email,
    customerIp: clientIp,
    merchantPosId: process.env.PAYU_POS_ID || "",
    description: "Przedłużenie usługi",
    totalAmount: productPrice.fullPrice * 100, // Amount in pennies - PLN * 100
    currencyCode: "PLN",
    "products[0].name": String(productPrice.periodInDays),
    "products[0].unitPrice": productPrice.fullPrice * 100,
    "products[0].quantity": 1,
    notifyUrl: process.env.NEXTAUTH_URL + "/api/payment/notification/payu",
    continueUrl: process.env.NEXTAUTH_URL + "/account/payments",
  };
  const signature = createSignature(fields);
  return {
    ...fields,
    "OpenPayu-Signature": signature,
  };
}

export function createSignature(fields: { [any: string]: unknown }) {
  const hashFunction: ALLOWED_HASH_FUNCTION = "SHA-512";
  const signatureHash = createSignatureHash(fields, hashFunction);
  return `signature=${signatureHash};algorithm=${hashFunction};sender=${process.env.PAYU_POS_ID}`;
}

function createSignatureHash(fields: Record<string, unknown>, algorithm: ALLOWED_HASH_FUNCTION) {
  const encodeValue = (v: string) => fullEncodeUriComponent(v).replace(/%20/g, "+");
  const sortedValues = Object.keys(fields)
    .sort()
    .map((k) => [k, fields[k]]);

  const content = sortedValues.reduce((current, [key, value]) => current + key + "=" + encodeValue(String(value)) + "&", "");
  const contentWithKey = content + process.env.PAYU_SECOND_KEY;
  return createHash(contentWithKey, algorithm);
}

export function verifySignature(inputData: string, signature: string) {
  // Example input: sender=checkout;signature=c33a38d89fb60f873c039fcec3a14743;algorithm=MD5;content=DOCUMENT
  const signatureArr = signature.split(";").map((pair) => pair.trim().split("="));
  const getValue = (key: string) => signatureArr.find(([k]) => k.toLowerCase() === key)?.[1];

  const algorithm = getValue("algorithm");
  const signatureHash = getValue("signature");

  if (!algorithm || !isAllowedHashFunction(algorithm) || !signatureHash) {
    return false;
  }

  const expectedSignatureHash = createHash(inputData + process.env.PAYU_SECOND_KEY, algorithm);

  return expectedSignatureHash === signatureHash;
}

type ALLOWED_HASH_FUNCTION = "SHA-256" | "SHA-384" | "SHA-512" | "MD5";

function isAllowedHashFunction(algorithm: string): algorithm is ALLOWED_HASH_FUNCTION {
  try {
    getCryptoHashFunctionName(algorithm as ALLOWED_HASH_FUNCTION);
    return true;
  } catch (e) {
    return false;
  }
}

function createHash(content: string, algorithm: ALLOWED_HASH_FUNCTION) {
  const cryptoHashAlgorithm = getCryptoHashFunctionName(algorithm);
  return crypto.createHash(cryptoHashAlgorithm).update(content).digest("hex");
}

function getCryptoHashFunctionName(algorithm: ALLOWED_HASH_FUNCTION) {
  switch (algorithm) {
    case "SHA-256":
    case "SHA-384":
    case "SHA-512":
      return algorithm.toLowerCase().replace("-", "");
    case "MD5":
      return "md5";
    default:
      throw new TypeError(`Unsupported Hash Function ${algorithm}`);
  }
}
