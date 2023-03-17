import type { NextApiRequest, NextApiResponse } from "next";
import {
  ZkConnect,
  ZkConnectServerConfig,
  DataRequest,
} from "@sismo-core/zk-connect-server";
import { NextRequest, NextResponse } from "next/server";

const zkConnectConfig: ZkConnectServerConfig = {
  appId: "0x52913711b4d9d877a522b06170b5648f", // appId you registered
  devMode: {
    enabled: true,
  },
};
export const zkConnect = ZkConnect(zkConnectConfig);

const THE_ETH_RICH_USERS = DataRequest({
  groupId: "0x42c768bb8ae79e4c5c05d3b51a4ec74a", // TODO: change this id to our group id created by Tom when PR merged
});

const vaultIdStore: string[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405);
  const { body } = req;

  const { zkConnectResponse } = body;
  try {
    const { vaultId } = await zkConnect.verify(zkConnectResponse, {
      dataRequest: THE_ETH_RICH_USERS,
    });
    console.log("vaultId", vaultId);
    if (vaultIdStore.includes(vaultId)) {
      return res.json({ status: "already-inside", vaultId });
    }
    vaultIdStore.push(vaultId);
    return res.json({ status: "enter-auction", vaultId });
  } catch (err) {
    debugger;
  }
  return res.json({});
}