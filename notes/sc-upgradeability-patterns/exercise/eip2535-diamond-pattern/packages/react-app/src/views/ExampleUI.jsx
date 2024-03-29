/* eslint-disable jsx-a11y/accessible-emoji */

import { SyncOutlined } from "@ant-design/icons";
import { formatEther, parseEther } from "@ethersproject/units";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { ContractFactory, ethers } from "ethers";
import { Address, Balance } from "../components";

export default function ExampleUI({
  purpose,
  setPurposeEvents,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const signer = localProvider.getSigner();
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const [abiFile, setAbiFile] = useState("loading...");
  const [facet, setFacet] = useState("loading...");

  let fileReader;
  function handleFileRead(e) {
    const content = fileReader.result;
    setAbiFile(JSON.parse(content));
  }
  function onFileChange(event) {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(event.target.files[0]);
  }

  const getSelector = artifacts => {
    const facetSelectorHash = [];
    for (const selector of artifacts.abi) {
      let selectorHash;
      if (selector.type === "function") {
        if (selector.inputs.length === 0) {
          selectorHash = ethers.utils.id(selector.name + "()").slice(0, 10);
        } else {
          selectorHash = selector.name + "(";
          for (const input of selector.inputs) {
            if (input === selector.inputs[selector.inputs.length - 1]) {
              selectorHash += input.type + ")";
            } else {
              selectorHash += input.type + ",";
            }
          }
          selectorHash = ethers.utils.id(selectorHash).slice(0, 10);
        }
        facetSelectorHash.push(selectorHash);
      }
    }
    return facetSelectorHash;
  };

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Diamond Starter</h2>
        <Divider />
        <div style={{ margin: 8 }}>
          {/* <Input
            onChange={e => {
              setNewPurpose(e.target.value);
            }}
          /> */}
          <input type="file" onChange={onFileChange} />

          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              const factory = new ContractFactory(abiFile.abi, abiFile.bytecode, localProvider.getSigner());
              const contract = await factory.deploy();
              await contract.deployed();
              console.log("deployed facet", contract.address);
              setFacet(contract.address);
            }}
          >
            Deploy Facet
          </Button>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              const facetSelector = await getSelector(abiFile);
              const data = writeContracts.DiamondCutFacet.interface.encodeFunctionData("diamondCut", [
                [[zeroAddress, 2, facetSelector]],
                zeroAddress,
                "0x",
              ]);
              tx(
                signer.sendTransaction({
                  to: writeContracts.Diamond.address,
                  data,
                  value: parseEther("0"),
                }),
              );
              /* look how you call setPurpose on your contract: */
              /* notice how you pass a call back for tx updates too */
              // const result = tx(writeContracts.YourContract.setPurpose(newPurpose), update => {
              //   console.log("📡 Transaction Update:", update);
              //   if (update && (update.status === "confirmed" || update.status === 1)) {
              //     console.log(" 🍾 Transaction " + update.hash + " finished!");
              //     console.log(
              //       " ⛽️ " +
              //         update.gasUsed +
              //         "/" +
              //         (update.gasLimit || update.gas) +
              //         " @ " +
              //         parseFloat(update.gasPrice) / 1000000000 +
              //         " gwei",
              //     );
              //   }
              // });
              // console.log("awaiting metamask/web3 confirm result...", result);
              // console.log(await result);
            }}
          >
            Upgrade Diamond
          </Button>
        </div>
        <Divider />
        Your Address:
        <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
        <Divider />
        ENS Address Example:
        <Address
          address="0x34aA3F359A9D614239015126635CE7732c18fDF3" /* this will show as austingriffith.eth */
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
        {/* use formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourLocalBalance ? formatEther(yourLocalBalance) : "..."}</h2>
        <div>OR</div>
        <Balance address={address} provider={localProvider} price={price} />
        <Divider />
        <div>🐳 Example Whale Balance:</div>
        <Balance balance={parseEther("1000")} provider={localProvider} price={price} />
        <Divider />
        {/* use formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourLocalBalance ? formatEther(yourLocalBalance) : "..."}</h2>
        <Divider />
        Your Contract Address:
        <Address
          address={readContracts ? readContracts.YourContract.address : readContracts}
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* look how you call setPurpose on your contract: */
              tx(writeContracts.YourContract.setPurpose("🍻 Cheers"));
            }}
          >
            Set Purpose to &quot;🍻 Cheers&quot;
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /*
              you can also just craft a transaction and send it to the tx() transactor
              here we are sending value straight to the contract's address:
            */
              tx({
                to: writeContracts.YourContract.address,
                value: parseEther("0.001"),
              });
              /* this should throw an error about "no fallback nor receive function" until you add it */
            }}
          >
            Send Value
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* look how we call setPurpose AND send some value along */
              tx(
                writeContracts.YourContract.setPurpose("💵 Paying for this one!", {
                  value: parseEther("0.001"),
                }),
              );
              /* this will fail until you make the setPurpose function payable */
            }}
          >
            Set Purpose With Value
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* you can also just craft a transaction and send it to the tx() transactor */
              tx({
                to: writeContracts.YourContract.address,
                value: parseEther("0.001"),
                data: writeContracts.YourContract.interface.encodeFunctionData("setPurpose(string)", [
                  "🤓 Whoa so 1337!",
                ]),
              });
              /* this should throw an error about "no fallback nor receive function" until you add it */
            }}
          >
            Another Example
          </Button>
        </div>
      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
      <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <h2>Events:</h2>
        <List
          bordered
          dataSource={setPurposeEvents}
          renderItem={item => {
            return (
              <List.Item key={item.blockNumber + "_" + item.sender + "_" + item.purpose}>
                <Address address={item[0]} ensProvider={mainnetProvider} fontSize={16} /> =&gt
                {item[1]}
              </List.Item>
            );
          }}
        />
      </div>

      <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 256 }}>
        <Card>
          Check out all the{" "}
          <a
            href="https://github.com/austintgriffith/scaffold-eth/tree/master/packages/react-app/src/components"
            target="_blank"
            rel="noopener noreferrer"
          >
            📦 components
          </a>
        </Card>

        <Card style={{ marginTop: 32 }}>
          <div>
            There are tons of generic components included from{" "}
            <a href="https://ant.design/components/overview/" target="_blank" rel="noopener noreferrer">
              🐜 ant.design
            </a>{" "}
            too!
          </div>

          <div style={{ marginTop: 8 }}>
            <Button type="primary">Buttons</Button>
          </div>

          <div style={{ marginTop: 8 }}>
            <SyncOutlined spin /> Icons
          </div>

          <div style={{ marginTop: 8 }}>
            Date Pickers?
            <div style={{ marginTop: 2 }}>
              <DatePicker onChange={() => {}} />
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <Slider range defaultValue={[20, 50]} onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Switch defaultChecked onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Progress percent={50} status="active" />
          </div>

          <div style={{ marginTop: 32 }}>
            <Spin />
          </div>
        </Card>
      </div>
    </div>
  );
}
