import Link from "next/link";
import { formatGas } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import DescriptionListItem from "@/components/lib/description-list-item";
import TimestampListItem from "@/components/lib/timestamp-list-item";
import { Block } from "@/lib/types";
import BlockHeight from "@/components/pages/block/block-height";
import BlockExtraData from "@/components/pages/block/block-extra-data";
import CopyButton from "@/components/lib/copy-button";

const BlockDetails = ({ block }: { block: Block }) => (
  <dl>
    <BlockHeight number={block.number} />
    <TimestampListItem timestamp={block.timestamp} />
    <DescriptionListItem title="Transactions">
      <Link
        href={`/block/${block.number}/txs`}
        className="mr-1 text-primary hover:brightness-150"
      >
        {block.transactions.length} transaction
        {block.transactions.length === 1 ? "" : "s"}
      </Link>
      in this block
    </DescriptionListItem>
    <Separator />
    <DescriptionListItem title="Gas Used">
      {formatGas(block.gasUsed).value}
      <span className="ml-1 text-muted-foreground">
        ({formatGas(block.gasUsed, block.gasLimit).percentageFormatted})
      </span>
    </DescriptionListItem>
    <DescriptionListItem title="Gas Limit">
      {formatGas(block.gasLimit).value}
    </DescriptionListItem>
    <BlockExtraData extraData={block.extraData} />
    <Separator />
    <DescriptionListItem title="Hash">
      <div className="flex items-center gap-2">
        {block.hash}
        <CopyButton content="Copy Hash" copy={block.hash} />
      </div>
    </DescriptionListItem>
    <DescriptionListItem title="Parent Hash">
      <div className="flex items-center gap-2">
        <Link
          href={`/block/${block.parentHash}`}
          className="text-primary hover:brightness-150"
        >
          {block.parentHash}
        </Link>
        <CopyButton content="Copy Parent Hash" copy={block.parentHash} />
      </div>
    </DescriptionListItem>
  </dl>
);

export default BlockDetails;
