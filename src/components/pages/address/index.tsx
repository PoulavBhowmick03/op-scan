import { Address } from "viem";
import { l2PublicClient } from "@/lib/chains";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import AddressDetails from "@/components/pages/address/address-details";
import { fetchSpotPrices } from "@/lib/fetch-data";
import CopyButton from "@/components/lib/copy-button";
import { fetchTokenHoldings } from "./fetch-token-holdings";

const AddressComponent = async ({ address }: { address: Address }) => {
  const [balance, bytecode, tokenHoldings, prices] = await Promise.all([
    l2PublicClient.getBalance({ address }),
    l2PublicClient.getCode({ address }),
    fetchTokenHoldings(address),
    fetchSpotPrices(),
  ]);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
      <div className="flex items-center">
        <Avatar className="mr-2 size-8">
          <AvatarImage
            src={`https://effigy.im/a/${address}.png`}
            alt="Ethereum avatar"
          />
          <AvatarFallback>0x</AvatarFallback>
        </Avatar>
        <h2 className="mr-2 text-2xl font-bold tracking-tight">
          {bytecode ? "Contract" : "Address"}
          <span className="ml-2 text-base font-normal">{address}</span>
        </h2>
        <CopyButton content="Copy Address" copy={address} />
      </div>
      <Separator />
      <AddressDetails
        tokenHoldings={tokenHoldings}
        balance={balance}
        ethPriceToday={prices.ETH}
      />
    </main>
  );
};

export default AddressComponent;
