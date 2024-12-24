import { createThirdwebClient } from "thirdweb";
const clientId = 'f56a0ad3303e05fdcec1e2d98bb93d88'

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId,
});
