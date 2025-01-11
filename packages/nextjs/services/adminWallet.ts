import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import scaffoldConfig from "~~/scaffold.config";

const { targetNetworks } = scaffoldConfig;

// Create account from private key
const account = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_KEY}`);

// Create wallet client for the target network
export const adminWalletClient = createWalletClient({
  account,
  chain: targetNetworks[0], // Use the first configured network
  transport: http(),
});
