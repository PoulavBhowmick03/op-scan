import { Hash, Address, Hex, TransactionType, getAddress } from "viem";
import {
  Prisma,
  erc1155Transfer as PrismaERC1155Transfer,
  erc20Transfer as PrismaERC20Transfer,
  erc721Transfer as PrismaERC721Transfer,
  Log as PrismaLog,
  Transaction as PrismaTransaction,
  TransactionEnqueued as PrismaTransactionEnqueued,
  TransactionReceipt as PrismaTransactionReceipt,
} from "@/prisma/generated/client";

export type Block = {
  number: bigint;
  hash: Hash;
  timestamp: bigint;
  gasUsed: bigint;
  gasLimit: bigint;
  extraData: Hex;
  parentHash: Hash;
  transactions: Hash[];
};

export type Transaction = {
  hash: Hash;
  blockNumber: bigint;
  from: Address;
  to: Address | null;
  value: bigint;
  gas: bigint;
  gasPrice: bigint | null;
  maxFeePerGas: bigint | null;
  maxPriorityFeePerGas: bigint | null;
  type: TransactionType;
  typeHex: Hex;
  nonce: number;
  transactionIndex: number;
  input: Hex;
  signature: string;
  timestamp: bigint;
};

export type BlockWithTransactions = Omit<Block, "transactions"> & {
  transactions: Transaction[];
};

export type TransactionReceipt = {
  transactionHash: Hash;
  status: "success" | "reverted";
  from: Address;
  to: Address | null;
  effectiveGasPrice: bigint;
  gasUsed: bigint;
  l1Fee: bigint | null;
  l1GasPrice: bigint | null;
  l1GasUsed: bigint | null;
  l1FeeScalar: number | null;
};

export type TransactionWithReceipt = Transaction & {
  receipt: TransactionReceipt;
};

export type BlockWithTransactionsAndReceipts = Omit<Block, "transactions"> & {
  transactions: TransactionWithReceipt[];
};

export type Log = {
  address: Address;
  blockNumber: bigint;
  blockHash: Hash;
  data: Hex;
  logIndex: number;
  transactionHash: Hash;
  transactionIndex: number;
  removed: boolean;
  topics: Hex[];
};

export type TransactionEnqueued = {
  l1BlockNumber: bigint;
  l2TxHash: Hash;
  timestamp: bigint;
  l1TxHash: Hash;
  l1TxOrigin: Address;
  gasLimit: bigint;
};

export type ERC20Transfer = {
  transactionHash: Hash;
  logIndex: number;
  address: Address;
  from: Address;
  to: Address;
  value: bigint;
  decimals: number;
  name: string;
  symbol: string;
};

export type ERC721Transfer = {
  transactionHash: Hash;
  logIndex: number;
  address: Address;
  from: Address;
  to: Address;
  tokenId: bigint;
  name: string;
  symbol: string;
};

export type ERC1155Transfer = {
  transactionHash: Hash;
  logIndex: number;
  address: Address;
  operator: Address;
  from: Address;
  to: Address;
  id: bigint;
  value: bigint;
};

export type ViemBlock = {
  number: bigint;
  hash: Hash;
  timestamp: bigint;
  gasUsed: bigint;
  gasLimit: bigint;
  extraData: Hex;
  parentHash: Hash;
  transactions: Hash[];
};

export type ViemTransaction = {
  hash: Hash;
  blockNumber: bigint;
  from: Address;
  to: Address | null;
  value: bigint;
  gas: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  type: TransactionType;
  typeHex: Hex | null;
  nonce: number;
  transactionIndex: number;
  input: Hex;
};

export type ViemBlockWithTransactions = Omit<ViemBlock, "transactions"> & {
  transactions: ViemTransaction[];
};

export type ViemTransactionReceipt = {
  transactionHash: Hash;
  status: "success" | "reverted";
  from: Address;
  to: Address | null;
  effectiveGasPrice: bigint | null;
  gasUsed: bigint;
  l1Fee: bigint | null;
  l1GasPrice: bigint | null;
  l1GasUsed: bigint | null;
  l1FeeScalar: number | null;
};

export type ViemLog = {
  address: Address;
  blockNumber: bigint;
  blockHash: Hash;
  data: Hex;
  logIndex: number;
  transactionHash: Hash;
  transactionIndex: number;
  removed: boolean;
  topics: Hex[];
};

export const fromViemBlock = (block: ViemBlock): Block => ({
  number: block.number,
  hash: block.hash,
  timestamp: block.timestamp,
  gasUsed: block.gasUsed,
  gasLimit: block.gasLimit,
  extraData: block.extraData,
  parentHash: block.parentHash,
  transactions: block.transactions,
});

export const fromViemBlockWithTransactionsAndReceipts = (
  block: ViemBlockWithTransactions,
  receipts: ViemTransactionReceipt[],
  signatures: string[] = [],
): BlockWithTransactionsAndReceipts => ({
  number: block.number,
  hash: block.hash,
  timestamp: block.timestamp,
  gasUsed: block.gasUsed,
  gasLimit: block.gasLimit,
  extraData: block.extraData,
  parentHash: block.parentHash,
  transactions: block.transactions.map((transaction, i) =>
    fromViemTransactionWithReceipt(
      transaction,
      receipts[i],
      block.timestamp,
      signatures[i],
    ),
  ),
});

export const fromViemTransaction = (
  transaction: ViemTransaction,
  timestamp: bigint,
  signature: string = "",
): Transaction => ({
  blockNumber: transaction.blockNumber,
  hash: transaction.hash,
  from: getAddress(transaction.from),
  to: transaction.to ? getAddress(transaction.to) : null,
  value: transaction.value,
  gas: transaction.gas,
  gasPrice: transaction.gasPrice ?? null,
  maxFeePerGas: transaction.maxFeePerGas ?? null,
  maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ?? null,
  transactionIndex: transaction.transactionIndex,
  type: transaction.type || "legacy",
  typeHex: transaction.typeHex || "0x1",
  nonce: transaction.nonce,
  input: transaction.input,
  signature,
  timestamp,
});

export const fromViemTransactionWithReceipt = (
  transaction: ViemTransaction,
  receipt: ViemTransactionReceipt,
  timestamp: bigint,
  signature: string = "",
): TransactionWithReceipt => ({
  blockNumber: transaction.blockNumber,
  hash: transaction.hash,
  from: getAddress(transaction.from),
  to: transaction.to ? getAddress(transaction.to) : null,
  value: transaction.value,
  gas: transaction.gas,
  gasPrice: transaction.gasPrice ?? null,
  maxFeePerGas: transaction.maxFeePerGas ?? null,
  maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ?? null,
  transactionIndex: transaction.transactionIndex,
  type: transaction.type || "legacy",
  typeHex: transaction.typeHex || "0x1",
  nonce: transaction.nonce,
  input: transaction.input,
  signature,
  timestamp,
  receipt: {
    transactionHash: receipt.transactionHash,
    status: receipt.status,
    from: getAddress(receipt.from),
    to: receipt.to ? getAddress(receipt.to) : null,
    effectiveGasPrice:
      receipt.effectiveGasPrice || transaction.gasPrice || BigInt(0),
    gasUsed: receipt.gasUsed,
    l1Fee: receipt.l1Fee,
    l1GasPrice: receipt.l1GasPrice,
    l1GasUsed: receipt.l1GasUsed,
    l1FeeScalar: receipt.l1FeeScalar,
  },
});

const prismaBlockWithTransactionsHashes =
  Prisma.validator<Prisma.BlockDefaultArgs>()({
    include: { transactions: { select: { hash: true } } },
  });

type PrismaBlockWithTransactionsHashes = Prisma.BlockGetPayload<
  typeof prismaBlockWithTransactionsHashes
>;

export const fromPrismaBlock = (
  block: PrismaBlockWithTransactionsHashes,
): Block => ({
  number: block.number,
  hash: block.hash as Hash,
  timestamp: block.timestamp,
  gasUsed: BigInt(block.gasUsed),
  gasLimit: BigInt(block.gasLimit),
  extraData: block.extraData as Hex,
  parentHash: block.parentHash as Hash,
  transactions: block.transactions.map(({ hash }) => hash as Hash),
});

const prismaBlockWithTransactionsAndReceipts =
  Prisma.validator<Prisma.BlockDefaultArgs>()({
    include: { transactions: { include: { receipt: true } } },
  });

type PrismaBlockWithTransactionsAndReceipts = Prisma.BlockGetPayload<
  typeof prismaBlockWithTransactionsAndReceipts
>;

export const fromPrismaBlockWithTransactionsAndReceipts = (
  block: PrismaBlockWithTransactionsAndReceipts,
  signatures: string[] = [],
): BlockWithTransactionsAndReceipts => ({
  number: block.number,
  hash: block.hash as Hash,
  timestamp: block.timestamp,
  gasUsed: BigInt(block.gasUsed),
  gasLimit: BigInt(block.gasLimit),
  extraData: block.extraData as Hex,
  parentHash: block.parentHash as Hash,
  transactions: block.transactions
    .map((transaction, i) => {
      if (!transaction.receipt) {
        return null;
      }
      return fromPrismaTransactionWithReceipt(
        transaction,
        transaction.receipt,
        signatures[i],
      );
    })
    .filter((transaction) => transaction !== null),
});

export const fromPrismaTransaction = (
  transaction: PrismaTransaction,
  signature: string = "",
): Transaction => ({
  hash: transaction.hash as Hash,
  blockNumber: transaction.blockNumber,
  from: transaction.from as Address,
  to: transaction.to ? (transaction.to as Address) : null,
  value: BigInt(transaction.value),
  gas: BigInt(transaction.gas),
  gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : null,
  maxFeePerGas: transaction.maxFeePerGas
    ? BigInt(transaction.maxFeePerGas)
    : null,
  maxPriorityFeePerGas: transaction.maxPriorityFeePerGas
    ? BigInt(transaction.maxPriorityFeePerGas)
    : null,
  type: transaction.type as TransactionType,
  typeHex: transaction.typeHex as Hex,
  nonce: transaction.nonce,
  transactionIndex: transaction.transactionIndex,
  input: transaction.input as Hex,
  signature,
  timestamp: transaction.timestamp,
});

export const fromPrismaTransactionWithReceipt = (
  transaction: PrismaTransaction,
  receipt: PrismaTransactionReceipt,
  signature: string = "",
): TransactionWithReceipt => ({
  hash: transaction.hash as Hash,
  blockNumber: transaction.blockNumber,
  from: transaction.from as Address,
  to: transaction.to ? (transaction.to as Address) : null,
  value: BigInt(transaction.value),
  gas: BigInt(transaction.gas),
  gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : null,
  maxFeePerGas: transaction.maxFeePerGas
    ? BigInt(transaction.maxFeePerGas)
    : null,
  maxPriorityFeePerGas: transaction.maxPriorityFeePerGas
    ? BigInt(transaction.maxPriorityFeePerGas)
    : null,
  type: transaction.type as TransactionType,
  typeHex: transaction.typeHex as Hex,
  nonce: transaction.nonce,
  transactionIndex: transaction.transactionIndex,
  input: transaction.input as Hex,
  signature,
  timestamp: transaction.timestamp,
  receipt: {
    transactionHash: receipt.transactionHash as Hash,
    status: receipt.status ? "success" : "reverted",
    from: receipt.from as Address,
    to: receipt.to ? (receipt.to as Address) : null,
    effectiveGasPrice: receipt.effectiveGasPrice
      ? BigInt(receipt.effectiveGasPrice)
      : transaction.gasPrice
        ? BigInt(transaction.gasPrice)
        : BigInt(0),
    gasUsed: BigInt(receipt.gasUsed),
    l1Fee: receipt.l1Fee ? BigInt(receipt.l1Fee) : null,
    l1GasPrice: receipt.l1GasPrice ? BigInt(receipt.l1GasPrice) : null,
    l1GasUsed: receipt.l1GasUsed ? BigInt(receipt.l1GasUsed) : null,
    l1FeeScalar: receipt.l1FeeScalar,
  },
});

export const fromPrismaLog = (log: PrismaLog): Log => ({
  address: log.address as Hash,
  blockNumber: log.blockNumber,
  blockHash: log.blockHash as Hash,
  data: log.data as Hex,
  logIndex: log.logIndex,
  transactionHash: log.transactionHash as Hash,
  transactionIndex: log.transactionIndex,
  removed: log.removed,
  topics: log.topics.split(",") as Hex[],
});

export const fromPrismaERC20Transfer = (
  erc20Transfer: PrismaERC20Transfer,
): ERC20Transfer => ({
  transactionHash: erc20Transfer.transactionHash as Hash,
  logIndex: erc20Transfer.logIndex,
  address: erc20Transfer.address as Address,
  from: erc20Transfer.from as Address,
  to: erc20Transfer.to as Address,
  value: BigInt(erc20Transfer.value),
  decimals: erc20Transfer.decimals,
  name: erc20Transfer.name,
  symbol: erc20Transfer.symbol,
});

export const fromPrismaERC721Transfer = (
  erc721Transfer: PrismaERC721Transfer,
): ERC721Transfer => ({
  transactionHash: erc721Transfer.transactionHash as Hash,
  logIndex: erc721Transfer.logIndex,
  address: erc721Transfer.address as Address,
  from: erc721Transfer.from as Address,
  to: erc721Transfer.to as Address,
  tokenId: BigInt(erc721Transfer.tokenId),
  name: erc721Transfer.name,
  symbol: erc721Transfer.symbol,
});

export const fromPrismaERC1155Transfer = (
  erc1155Transfer: PrismaERC1155Transfer,
): ERC1155Transfer => ({
  transactionHash: erc1155Transfer.transactionHash as Hash,
  logIndex: erc1155Transfer.logIndex,
  address: erc1155Transfer.address as Address,
  operator: erc1155Transfer.operator as Address,
  from: erc1155Transfer.from as Address,
  to: erc1155Transfer.to as Address,
  id: BigInt(erc1155Transfer.id),
  value: BigInt(erc1155Transfer.value),
});

export const fromPrismaTransactionEnqueued = (
  transaction: PrismaTransactionEnqueued,
): TransactionEnqueued => ({
  l1BlockNumber: transaction.l1BlockNumber,
  l2TxHash: transaction.l2TxHash as Hash,
  timestamp: transaction.timestamp,
  l1TxHash: transaction.l1TxHash as Hash,
  l1TxOrigin: transaction.l1TxOrigin as Address,
  gasLimit: BigInt(transaction.gasLimit),
});
