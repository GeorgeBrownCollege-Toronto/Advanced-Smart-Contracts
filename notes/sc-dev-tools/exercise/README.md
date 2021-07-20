## Exercise : Create your own private Network And mine some Ether

First you need to download and install geth. Geth can be downloaded from here: https://geth.ethereum.org/downloads/

### LINUX/UBUNTU USERS:

You can also install geth directly:

```bash
sudo apt-get install software-properties-common`
```
```bash
sudo add-apt-repository -y ppa:ethereum/ethereum
```
```bash
sudo apt-get update
```
```bash
sudo apt-get install geth
```

### MAC OS USERS:

You don't need to use Homebrew to install Geth. Just unzip the archive for Mac OS. The executables just run in place. Do the following.

1. Unzip the Geth archive in your `~/Applications` folder (not my system `/Applications` folder).

2. Rename the resulting folder to `~/Applications/geth-1.10.1` (or to your version number).

3. Create a soft link to it. CD to the `~/Applications` folder and run: `ln -s geth-1.10.1/geth`

4. Add the `~/Application/geth-1.10.1` folder to your `PATH`. 
Run `export PATH=$PATH:~/Applications/geth-1.10.1` 
5. Restart the command window

> - Update geth to a newer version, for example `geth-1.10.2`? 
> - Download and expand it like above. So now you have inside your `~/Applications` directory: 
> 	- `geth-1.10.2` (after renaming the expanded archive) 
>	- `geth` (which is a soft link to `geth-1.10.1`).
> - Switch the softlink to use the new Geth. `rm geth; ln -s geth-1.10.2 geth`
> - Restart the browser

### WINDOWS USERS:

Download the Installer, follow the wizard.

Geth is a Go-Implementation of the Ethereum Protocol. At the time of writing it does not feature any automatic update mechanism, so it's good to check from time to time for newer versions.

After downloading Geth, you also need to have your very own `genesis.json` file. 
It should look like this:

```json
{
  "config": 
  {
		"chainId": 33,
		"homesteadBlock": 0,
		"eip150Block":0,
		"eip155Block": 0,
		"eip158Block": 0
	},
	"nonce": "0x0000000000000033",
	"timestamp": "0x0",
	"parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
	"gasLimit": "0x8000000",
	"difficulty": "0x100",
	"mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
	"coinbase": "0x3333333333333333333333333333333333333333",
	"alloc": {}
}
```
Let's open a console now and and get started in a new, empty folder. Let's call this folder `private-ethereum` and currently there is nothing inside. Follow these steps:

- Save the  genesis.json   file inside the folder `private-ethereum`
- Open a Terminal/Console/PowerShell window and go to the folder `private-ethereum`
- Create a new folder called `chaindata` inside `private-ethereum` - don't go inside that folder
- You have now inside the `private-ethereum` folder another folder called `chaindata` and the `genesis.json` file. And the Terminal is still open. Now, let's initialize a private chain inside that folder. Type in

 ```bash
 geth --datadir=./chaindata init ./genesis.json 
 ```

- You should see something like this output:

```console
INFO [03-20|23:45:24.083] Maximum peer count                       ETH=50 LES=0 total=50
INFO [03-20|23:45:24.088] Set global gas cap                       cap=25000000
INFO [03-20|23:45:24.090] Allocated cache and file handles         database=/Users/dhruvin/gbc/bcdv-1013/private-ethereum/chaindata/geth/chaindata cache=16.00MiB handles=16
INFO [03-20|23:45:24.171] Writing custom genesis block 
INFO [03-20|23:45:24.174] Persisted trie from memory database      nodes=0 size=0.00B time="17.02µs" gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
INFO [03-20|23:45:24.174] Successfully wrote genesis state         database=chaindata hash="5704d0…9bc5b0"
INFO [03-20|23:45:24.175] Allocated cache and file handles         database=/Users/dhruvin/gbc/bcdv-1013/private-ethereum/chaindata/geth/lightchaindata cache=16.00MiB handles=16
INFO [03-20|23:45:24.249] Writing custom genesis block 
INFO [03-20|23:45:24.250] Persisted trie from memory database      nodes=0 size=0.00B time="5.578µs" gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
INFO [03-20|23:45:24.251] Successfully wrote genesis state         database=lightchaindata hash="5704d0…9bc5b0"

```
Then geth stops. So now you have initialized your private chain inside the chaindata directory. There are no files written somewhere else. As long as geth is not running you can freely move the files around, it's a completely self-contained file-based database of the blockchain (your private chain).

You now have to start geth with that chaindata directory:

```bash
geth --datadir=./chaindata --nodiscover
```

Eventually you will need an additional flag `--nodiscover` when you start `geth`.

It should start and you should see two lines to pay special attention to.

First, it should output the config somewhere. This should contain the same ChainID as you have in your genesis.json file:

```bash
INFO [03-20|23:46:29.755] Initialised chain configuration          config="{ChainID: 33 Homestead: 0 DAO: <nil> DAOSupport: false EIP150: 0 EIP155: 0 EIP158: 0 Byzantium: <nil> Constantinople: <nil> Petersburg: <nil> Istanbul: <nil>, Muir Glacier: <nil>, Berlin: <nil>, YOLO v3: <nil>, Engine: unknown}"
```

### MAC/LINUX USERS: 
The second line to pay attention to is the line of the `geth.ipc` file, which will be necessary in the next sections:

```bash
INFO [03-21|00:01:43.630] IPC endpoint opened                      url=/Users/dhruvin/gbc/bcdv-1013/private-ethereum/chaindata/geth.ipc 
```

#### On windows, 

- since go-ethereum 1.8, you really need to specify the full path to the geth.ipc file. Eventhough it's just a pipe, you need to enter geth attach `ipc://./pipe/geth.ipc`  or something similar, depending where the geth.ipc file is located. 

#### On mac and linux, 

- You need to provide the path to the geth.ipc file. Look in the log-output of geth where the ipc file is located and then attach with

### `geth attach`

- Open new terminal window

- `geth attach /Users/dhruvin/gbc/bcdv-1013/private-ethereum/chaindata/geth.ipc`

- You should see a console

- run `admin` and watch the output

- To create a new account run `personal.newAccount()`. Provide the password when prompted
> Check chaindata/keystore directory in the file explorer to see the account file.

- Get the list of accounts : run `eth.accounts`

### mining

- set coinbase account : `miner.setEtherbase(eth.accounts[0])`
> This is where all the ethers rewarded during mining will be credited

- to start mining : `miner.start(1)`
> to stop mining : `miner.stop()`

```console
INFO [03-21|16:01:16.242] Successfully sealed new block            number=1 sealhash="de0588…cfe561" hash="940c68…fbd2c8" elapsed=41.221s
INFO [03-21|16:01:16.243] Commit new mining work                   number=2 sealhash="052be1…73e053" uncles=0 txs=0 gas=0 fees=0 elapsed="786.944µs"
INFO [03-21|16:01:16.243] 🔨 mined potential block                  number=1 hash="940c68…fbd2c8"
INFO [03-21|16:01:19.450] Successfully sealed new block            number=2 sealhash="052be1…73e053" hash="5aee3c…389e2f" elapsed=3.206s
INFO [03-21|16:01:19.450] 🔨 mined potential block                  number=2 hash="5aee3c…389e2f"
INFO [03-21|16:01:19.450] Commit new mining work                   number=3 sealhash="1c9865…f77f61" uncles=0 txs=0 gas=0 fees=0 elapsed="192.028µs"
INFO [03-21|16:01:21.132] Successfully sealed new block            number=3 sealhash="1c9865…f77f61" hash="697329…103d4a" elapsed=1.682s
```

- To check the balance in your etherbase account : `eth.getBalance(eth.accounts[0])`
> This will show in wei units

- TO check balance in ether : `web3.fromWei(eth.getBalance(eth.accounts[0]),"ether")`

## Tips and trick

- Stop all the sessions running in both terminal. Close the terminal that was running `geth attach`

- To start mining with one command goto the `private-ethereum` directory : `geth --datadir=./chaindata --nodiscover --unlock="<account-address>" --mine=1` . Provide the password to unlock your account
> Run `geth --datadir=./chaindata account list` to get list of accounts from keystore

- You'll see following output :

```console
INFO [03-21|16:18:34.333] Starting Geth on Ethereum mainnet...
INFO [03-21|16:18:34.333] Bumping default cache on mainnet         provided=1024 updated=4096
WARN [03-21|16:18:34.333] Sanitizing cache to Go's GC limits       provided=4096 updated=2730
INFO [03-21|16:18:34.335] Maximum peer count                       ETH=50 LES=0 total=50
INFO [03-21|16:18:34.336] Set global gas cap                       cap=25000000
INFO [03-21|16:18:34.336] Allocated trie memory caches             clean=409.00MiB dirty=682.00MiB
INFO [03-21|16:18:34.336] Allocated cache and file handles         database=/Users/dhruvin/gbc/bcdv-1013/private-ethereum/chaindata/geth/chaindata cache=1.33GiB handles=5120
INFO [03-21|16:18:34.460] Opened ancient database                  database=/Users/dhruvin/gbc/bcdv-1013/private-ethereum/chaindata/geth/chaindata/ancient
INFO [03-21|16:18:34.460] Initialised chain configuration          config="{ChainID: 33 Homestead: 0 DAO: <nil> DAOSupport: false EIP150: 0 EIP155: 0 EIP158: 0 Byzantium: <nil> Constantinople: <nil> Petersburg: <nil> Istanbul: <nil>, Muir Glacier: <nil>, Berlin: <nil>, YOLO v3: <nil>, Engine: unknown}"
INFO [03-21|16:18:34.461] Disk storage enabled for ethash caches   dir=/Users/dhruvin/gbc/bcdv-1013/private-ethereum/chaindata/geth/ethash count=3
INFO [03-21|16:18:34.461] Disk storage enabled for ethash DAGs     dir=/Users/dhruvin/Library/Ethash count=2
INFO [03-21|16:18:34.461] Initialising Ethereum protocol           network=1 dbversion=8
INFO [03-21|16:18:34.462] Loaded most recent local header          number=160 hash="876d6e…dd19b7" td=21786773 age=11m25s
INFO [03-21|16:18:34.462] Loaded most recent local full block      number=160 hash="876d6e…dd19b7" td=21786773 age=11m25s
INFO [03-21|16:18:34.462] Loaded most recent local fast block      number=160 hash="876d6e…dd19b7" td=21786773 age=11m25s
INFO [03-21|16:18:34.470] Loaded local transaction journal         transactions=0 dropped=0
INFO [03-21|16:18:34.471] Regenerated local transaction journal    transactions=0 accounts=0
WARN [03-21|16:18:34.471] Switch sync mode from fast sync to full sync
INFO [03-21|16:18:34.471] Starting peer-to-peer node               instance=Geth/v1.10.1-stable-c2d2f4ed/darwin-amd64/go1.16
INFO [03-21|16:18:34.570] New local node record                    seq=3 id=741effae6ae06314 ip=127.0.0.1 udp=0 tcp=30303
INFO [03-21|16:18:34.570] Started P2P networking                   self="enode://ae51ccca5081fbb82d2ee10bb7410fe2016d437c06ccfdff15b3e18d97c1aa7ea49189845b7ba05d50014b9e89f6597ac858924fa8f1b03d470bab11b6fa67dd@127.0.0.1:30303?discport=0"
INFO [03-21|16:18:34.571] IPC endpoint opened                      url=/Users/dhruvin/gbc/bcdv-1013/private-ethereum/chaindata/geth.ipc
Unlocking account 3fbbbe3346a2f142fdfc4c8b9d93cca1f149ce2b | Attempt 1/3
Password: INFO [03-21|16:18:34.648] Mapped network port                      proto=tcp extport=30303 intport=30303 interface=NAT-PMP(192.168.0.1)

INFO [03-21|16:18:40.750] Unlocked account                         address=0x3fbBbe3346a2F142fdfc4c8b9d93cCA1f149CE2B
INFO [03-21|16:18:40.751] Transaction pool price threshold updated price=1000000000
INFO [03-21|16:18:40.751] Updated mining threads                   threads=0
INFO [03-21|16:18:40.751] Transaction pool price threshold updated price=1000000000
INFO [03-21|16:18:40.751] Etherbase automatically configured       address=0x3fbBbe3346a2F142fdfc4c8b9d93cCA1f149CE2B
INFO [03-21|16:18:40.751] Commit new mining work                   number=161 sealhash="568126…c377fd" uncles=0 txs=0 gas=0 fees=0 elapsed="137.768µs"
```

This works so far then you have successfully setup private ethereum node.
