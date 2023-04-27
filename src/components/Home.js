import React from "react";
import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { formatEther } from "ethers/lib/utils";
import { Link } from "react-router-dom";
import { Container, Table } from "react-bootstrap";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
export const alchemy = new Alchemy(settings);

export function Home() {
  const [latestBlocks, setLatestBlocks] = useState();
  const [blockNumber, setBlockNumber] = useState();
  const [latestTransactions, setLatestTransactions] = useState();

  useEffect(() => {
    let blockArray = [];
    let transactionArray = [];
    const getLatestBlocks = async () => {
      const blockNumber = await alchemy.core.getBlockNumber();
      setBlockNumber(blockNumber);

      for (let i = 0; i < 15; i++) {
        const block = await alchemy.core.getBlock(blockNumber - i);
        blockArray.push(block);
      }
      setLatestBlocks(blockArray);
      console.log(blockArray);
      console.log("latest block: ", latestBlocks);
    };

    const getLatestTransactions = async () => {
      const lastBlock = await alchemy.core.getBlockWithTransactions(blockNumber);

      for (let i = 0; i < 15; i++) {
        transactionArray.push(lastBlock.transactions[i]);
      }
      setLatestTransactions(transactionArray);
      console.log("latest transactions: ", latestTransactions);
    };

    getLatestBlocks();
    getLatestTransactions();
  }, []);

  return (
    <div>
      <Container className="wrapper">
        <br />
        {!latestTransactions || !latestBlocks ? (
          <div> Loading... </div>
        ) : (
          <>
            <Container className="latestBlock">
              <Table striped responsive hover>
                <thead>
                  <tr>
                    <th>Latest Blocks</th>
                  </tr>
                </thead>
                <tbody>
                  {latestBlocks.map((block) => {
                    return (
                      <tr >
                        <td>
                          Block{" "}
                          <Link to={`/block/${block.number}`}>
                            {block.number}
                          </Link>{" "}
                        </td>
                        <td>
                          Fee recipient{" "}
                          <Link to={`/address/${block.miner}`}>
                            {block.miner.slice(0, 10)}...
                          </Link>
                        </td>
                        <td>{block.transactions.length} tx</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Container>
            <Container className="latestTable">
              <Table striped responsive hover>
                <thead>
                  <tr>
                    <th>Latest Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {latestTransactions.map((transaction, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          <Link to={`/transaction/${transaction.hash}`}>
                            {transaction.hash.slice(0, 15)}...
                          </Link>
                        </td>
                        <td>
                          From:{" "}
                          <Link to={`/address/${transaction.from}`}>
                            {transaction.from.slice(0, 10)}...
                          </Link>
                          <br />
                          To:{" "}
                          <Link to={`/address/${transaction.to}`}>
                            {transaction.to.slice(0, 10)}...
                          </Link>
                        </td>
                        {/* gas price */}
                        <td>
                          {formatEther(transaction.value).slice(0, 5)} ETH
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Container>
          </>
        )}
      </Container>
    </div>
  );
}
