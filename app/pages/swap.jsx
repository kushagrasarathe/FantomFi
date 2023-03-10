import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Fragment, useEffect, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { tokens } from "../utils/tokens";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import styles from "../styles/Home.module.css";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import { Contract, ethers } from "ethers";
import {
  SWAP_ROUTER_ADDRESS,
  SWAP_ROUTER_ABI,
  Token_ABI,
} from "../constants/constants";
import { Spinner } from "flowbite-react";

const token1 = tokens;
const token2 = tokens;

export default function Swap() {
  const [expand, setExpand] = useState(false);
  const [selectedToken1, setSelectedToken1] = useState(token1[0]);
  const [selectedToken2, setSelectedToken2] = useState(token2[0]);

  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const contract = useContract({
    address: SWAP_ROUTER_ADDRESS,
    abi: SWAP_ROUTER_ABI,
    signerOrProvider: signer || provider,
  });

  const [reserveA, setReserveA] = useState(0);
  const [reserveB, setReserveB] = useState(0);
  const [amountOne, setAmountOne] = useState(0);
  const [amountTwo, setAmountTwo] = useState(0);
  const [exactAmountIn, setExactAmountIn] = useState(false);
  const [exactAmountOut, setExactAmountOut] = useState(false);
  const [amountOut, setAmountOut] = useState(0);
  const [amountIn, setAmountIn] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [inputAmount, setInputAmount] = useState(0);

  // function checkIfAmountSet() {
  //   if (amountOne > 0) {
  //     setExactAmountIn(true);
  //   } else if (amountTwo > 0) {
  //     setExactAmountOut(true);
  //   }
  // }

  const getDeadline = () => {
    const _deadline = Math.floor(Date.now() / 1000) + 600;
    console.log(_deadline);
    return _deadline;
  };

  function handleInput(event) {
    setInputAmount(+event.target.value);
  }

  // ask dhruv about the params
  const swap = async () => {
    try {
      if (amounts && path) {
        const _swap = await contract._swap(amounts, path, address);
        setLoading(true);
        await _swap.wait();
        setLoading(false);
        // toast.success("")
      }
    } catch (err) {
      // toast.error(err.reason)
      console.error(err);
    }
  };

  const pathTK12 = [
    "0x8293ab89EB972186D928C827FbE47e29d46606D7",
    "0x3ebc886aBd59eB66146BD2bcee4de7BEA3Fd2eb6",
  ];

  const pathTK21 = [
    "0x3ebc886aBd59eB66146BD2bcee4de7BEA3Fd2eb6",
    "0x8293ab89EB972186D928C827FbE47e29d46606D7",
  ];

  const pathXTk1 = [
    "0xeDFA5C57C5396d2767bf74368291c9890BcDea14",
    "0x8293ab89EB972186D928C827FbE47e29d46606D7",
  ];

  const pathTk1X = [
    "0x8293ab89EB972186D928C827FbE47e29d46606D7",
    "0xeDFA5C57C5396d2767bf74368291c9890BcDea14",
  ];

  const pathXTk2 = [
    "0xeDFA5C57C5396d2767bf74368291c9890BcDea14",
    "0x3ebc886aBd59eB66146BD2bcee4de7BEA3Fd2eb6",
  ];

  const pathTk2X = [
    "0x3ebc886aBd59eB66146BD2bcee4de7BEA3Fd2eb6",
    "0xeDFA5C57C5396d2767bf74368291c9890BcDea14",
  ];

  const handleSwapSubmit = () => {
    try {
      setLoading(true);
      if (
        exactAmountIn &&
        selectedToken1.symbol != "FTM" &&
        selectedToken2.symbol != "FTM"
      ) {
        if (selectedToken1.symbol == "Tk1") {
          swapExactAmountOfTokens(amountOne, pathTK12);
        } else if (selectedToken1.symbol == "Tk2") {
          swapExactAmountOfTokens(amountOne, pathTK21);
        }
      } else if (
        exactAmountOut &&
        selectedToken1.symbol != "FTM" &&
        selectedToken2.symbol != "FTM"
      ) {
        if (selectedToken1.symbol == "Tk1") {
          swapTokensForExactAmount(amountTwo, pathTK12);
        } else if (selectedToken1.symbol == "Tk2") {
          swapExactAmountOfTokens(amountTwo, pathTK21);
        }
      } else if (exactAmountIn) {
        if (selectedToken1.symbol == "FTM" && selectedToken2.symbol != "FTM") {
          if (selectedToken2.symbol == "Tk1") {
            swapExactAmountOfEthForTokens(amountOne, pathXTk1);
          } else if (selectedToken2.symbol == "Tk2") {
            swapExactAmountOfEthForTokens(amountOne, pathXTk2);
          }
        } else if (
          selectedToken1.symbol != "FTM" &&
          selectedToken2.symbol == "FTM"
        ) {
          if (selectedToken1.symbol == "Tk1") {
            swapExactAmountOfTokensForEth(amountOne, pathTk1X);
          } else if (selectedToken1.symbol == "Tk2") {
            swapExactAmountOfTokensForEth(amountOne, pathTk2X);
          }
        }
      } else if (exactAmountOut) {
        if (selectedToken1.symbol == "FTM" && selectedToken2.symbol != "FTM") {
          if (selectedToken2.symbol == "Tk1") {
            swapEthForExactAmountOfTokens(amountTwo, pathXTk1, amountOne);
          } else if (selectedToken2.symbol == "Tk2") {
            swapEthForExactAmountOfTokens(amountTwo, pathXTk2, amountOne);
          }
        } else if (
          selectedToken1.symbol != "FTM" &&
          selectedToken2.symbol == "FTM"
        ) {
          if (selectedToken1.symbol == "Tk1") {
            swapTokensForExactAmountOfEth(amountTwo, pathTk1X, amountOne);
          } else if (selectedToken1.symbol == "Tk2") {
            swapTokensForExactAmountOfEth(amountTwo, pathTk2X, amountOne);
          }
        }
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const approveTokens = async (tokenInAddress, amountIn) => {
    try {
      const Token_contract = new Contract(tokenInAddress, Token_ABI, signer);

      const tx = await Token_contract.approve(
        SWAP_ROUTER_ADDRESS,
        ethers.utils.parseEther(amountIn.toString())
      );

      await tx.wait();
      return true;
    } catch (err) {
      console.log(err);
    }
  };

  // ask dhruv about params
  const swapExactAmountOfTokens = async (valueIn, path) => {
    try {
      if (valueIn) {
        setLoading(true);
        await approveTokens(selectedToken1.address, valueIn);
        // path[0] = selectedToken1.address;
        // path[1] = selectedToken1.address;
        const deadline = getDeadline();
        console.log(path, valueIn);
        const _swapExactTokens = await contract.swapExactTokensForTokens(
          ethers.utils.parseEther(valueIn.toString()),
          1,
          path,
          address,
          deadline
        );
        await _swapExactTokens.wait();
        setLoading(false);
        // taost.success("swapped");
      }
    } catch (err) {
      // toast.err(err.reason)
      setLoading(true);
      console.error(err);
    }
  };

  const swapTokensForExactAmount = async (valueOut, path) => {
    try {
      if (valueOut) {
        setLoading(true);
        const deadline = getDeadline();
        // console.log(valueOut);
        const _swapTokens = await contract.swapTokensForExactTokens(
          ethers.utils.parseEther(valueOut.toString()),
          1,
          path,
          address,
          deadline
        );
        await _swapTokens.wait();
        setLoading(false);
        // taost.success("SWAPPED!!!");
      }
    } catch (err) {
      // taost.error("err.reason")
      setLoading(true);
      console.error(err);
    }
  };

  // payable func
  const swapExactAmountOfEthForTokens = async (valueIn, path) => {
    try {
      if (valueIn) {
        setLoading(true);
        const _amount = ethers.utils.parseEther(valueIn.toString());
        const _deadline = getDeadline();
        const _swapEth = await contract.swapExactETHForTokens(
          1,
          path,
          address,
          _deadline,
          {
            value: _amount,
          }
        );
        await _swapEth.wait();
        setLoading(false);
        // toast.success();
      }
    } catch (err) {
      // taost.error(err.reason);
      console.error(err);
    }
  };

  const swapEthForExactAmountOfTokens = async (valueOut, path, valueETH) => {
    try {
      if (valueOut) {
        setLoading(true);
        const _amount = ethers.utils.parseEther(valueETH.toString());
        const _deadline = getDeadline();
        const _swapTokens = await contract.swapETHForExactTokens(
          ethers.utils.parseEther(valueOut.toString()),
          path,
          address,
          _deadline,
          {
            value: _amount,
          }
        );
        await _swapTokens.wait();
        setLoading(false);
        // toast.success();
      }
    } catch (err) {
      // toast.error(err.reason);
      console.error(err.reason);
    }
  };

  const swapTokensForExactAmountOfEth = async (valueOut, path, valueIn) => {
    try {
      if (valueOut) {
        setLoading(true);
        await approveTokens(
          selectedToken1.address,
          ethers.utils.parseEther(valueIn.toString())
        );
        const _deadline = getDeadline();
        const _swapTokensForEth = await contract.swapTokensForExactETH(
          ethers.utils.parseEther(valueOut.toString()),
          1,
          path,
          address,
          _deadline
        );
        await _swapTokensForEth.wait();
        setLoading(false);
        // taost.success("");
      }
    } catch (err) {
      // toast.error(err.reason);
      console.error(err);
    }
  };

  const swapExactAmountOfTokensForEth = async (valueIn, path) => {
    try {
      if (valueIn) {
        setLoading(true);
        await approveTokens(
          selectedToken1.address,
          ethers.utils.parseEther(valueIn.toString())
        );
        const _deadline = getDeadline();
        const _swapTokensForEth = await contract.swapExactTokensForETH(
          ethers.utils.parseEther(valueIn.toString()),
          1,
          path,
          address,
          _deadline
        );
        await _swapTokensForEth.wait();
        setLoading(false);
        // toast.success("asdf");
      }
    } catch (err) {
      // toast.error("")
      console.error(err);
    }
  };

  // 3 params on this one
  const quote = async () => {
    try {
      const _fetchQuote = await contract.quote(0, 0, 0);
      // setQuote(_fetchQuote);
    } catch (err) {
      // toast.error(err.reason);
      console.error(err);
    }
  };

  /// As Soon as user selects both the tokens , call getReserve
  const getReserves = async (tokenA, tokenB) => {
    const response = await contract.getReserve(tokenA, tokenB);
    setReserveA(ethers.utils.formatEther(response.reserveA));
    setReserveB(ethers.utils.formatEther(response.reserveB));
    console.log(
      ethers.utils.formatEther(response.reserveA),
      ethers.utils.formatEther(response.reserveB)
    );
    // setOutAmount(_getAmount);
  };

  /// Exact Amount in , user give 1st input
  const getAmountOut = async (amountA, reserveA, reserveB) => {
    if (amountA != 0) {
      const amountOut = await contract.getAmountOut(
        ethers.utils.parseEther(amountA.toString()),
        ethers.utils.parseEther(reserveA.toString()),
        ethers.utils.parseEther(reserveB.toString())
      );

      console.log(ethers.utils.formatEther(amountOut));
      setAmountOut(ethers.utils.formatEther(amountOut));
      setAmountTwo(ethers.utils.formatEther(amountOut));
    }
  };

  /// Exact Amount out , user give 2nd input
  const getAmountIn = async (amountB, reserveA, reserveB) => {
    if (amountB != 0) {
      const amountIn = await contract.getAmountIn(
        ethers.utils.parseEther(amountB.toString()),
        ethers.utils.parseEther(reserveA.toString()),
        ethers.utils.parseEther(reserveB.toString())
      );

      console.log(ethers.utils.formatEther(amountIn));
      setAmountIn(ethers.utils.formatEther(amountIn));
      setAmountOne(ethers.utils.formatEther(amountIn));
    }
  };

  /// fetched reserves when both tokens are set
  useEffect(() => {
    console.log(selectedToken1, selectedToken2);
    if (
      selectedToken1 != 0 &&
      selectedToken2 != 0 &&
      selectedToken1 != selectedToken2
    ) {
      // if (selectedToken1.symbol != "FTM" && selectedToken2.symbol != "FTM") {
      //   getReserves(selectedToken1.address, selectedToken2.address);
      // }
      getReserves(selectedToken1.address, selectedToken2.address);
    }
  }, [selectedToken1, selectedToken2]);

  return (
    <div
      // `${styles.bg} bg-[url('../assets/landing.png')]`
      className={`w-screen min-h-screen no-repeat bg-cover bg-[#03071E]
      ${!expand ? `bg-[#4532a1]` : `bg-[#03071E]`}
          `}
    >
      <Navbar expand={expand} setExpand={setExpand} />
      {expand ? null : (
        <div className=" w-full flex flex-col justify-center items-center px-2">
          <div className=" lg:max-w-xl rounded-md mx-auto lg:mx-auto font-fredoka text-white px-0 py-0 bg-[#03071e68] opacity-100 backdrop-blur-lg flex flex-col items-center justify-center mt-32 md:mt-12 xl:mt-32 2xl:mt-40 mb-32 ">
            <h2 className=" rounded-t-md text-xl font-semibold tracking-wid w-full bg-[blue-700] py-4 px-4 border-b border-gray-400">
              Swap Tokens
            </h2>

            <div className=" px-4 py-8">
              <label className="" htmlFor="">
                Enter Value
              </label>
              <div className="mt-2 w-full flex items-center justify-between mb-2">
                <input
                  type="number"
                  id=""
                  className="bg-gray-50 border  lg:w-full w-32 border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-[#b49af9]  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="0"
                  required
                  value={amountOne}
                  onChange={(e) => {
                    setAmountOne(e.target.value);
                    getAmountOut(e.target.value, reserveA, reserveB);
                    setExactAmountIn(true);
                  }}
                />
                <div className="lg:w-28 w-24 "></div>
                {/* <button
                  //   onClick={openModal}
                  type="button"
                  className="text-white mt-1  bg-blue-700 text-sm hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md lg:w-48 px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Select Token
                </button> */}
                <Listbox value={selectedToken1} onChange={setSelectedToken1}>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative  cursor-default rounded-md w-28 lg:w-36 px-4 py-2.5 bg-[#b49af9]  pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate">
                        {selectedToken1.symbol}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-200"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100 "
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full z-[100] overflow-auto rounded-md  bg-transparent backdrop-blur-xl py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {tokens.map((token, tokenId) => (
                          <Listbox.Option
                            key={tokenId}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-100"
                              }`
                            }
                            value={token}
                          >
                            {({ selectedToken1 }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selectedToken1
                                      ? "font-medium"
                                      : "font-normal"
                                  }`}
                                >
                                  {token.symbol}
                                </span>
                                {selectedToken1 ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                    <CheckIcon
                                      className="h-5 w-5 text-gray-900"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              <label className="mt-6" htmlFor="">
                Enter Value
              </label>

              <div className=" w-full flex items-center justify-between ">
                <input
                  type="number"
                  id=""
                  className="mt-2  bg-gray-50 border lg:w-full w-32 border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-[#b49af9]  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="0"
                  required
                  value={amountTwo}
                  onChange={(e) => {
                    setAmountTwo(e.target.value);
                    getAmountIn(e.target.value, reserveA, reserveB);
                    setExactAmountOut(true);
                  }}
                />
                <div className="lg:w-28 w-24 "></div>
                {/* <button
                  //   onClick={openModal}
                  type="button"
                  className="text-white mt-1  bg-blue-700 text-sm hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md lg:w-48 px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Select Token
                </button> */}
                <Listbox value={selectedToken2} onChange={setSelectedToken2}>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative cursor-default rounded-md w-28 lg:w-36 px-4 py-2.5 bg-[#b49af9]  pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate">
                        {selectedToken2.symbol}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-200"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md  bg-transparent backdrop-blur-xl py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {tokens.map((token, tokenId) => (
                          <Listbox.Option
                            key={tokenId}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-100"
                              }`
                            }
                            value={token}
                          >
                            {({ selectedToken2 }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selectedToken2
                                      ? "font-medium"
                                      : "font-normal"
                                  }`}
                                >
                                  {token.symbol}
                                </span>
                                {selectedToken2 ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                    <CheckIcon
                                      className="h-5 w-5 text-gray-900"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              <div className="px-2 border-t border-gray-400 pt-6 w-full mt-6 mx-auto">
                <button
                  type="button"
                  className="flex justify-center items-center text-white w-full bg-[#b49af9]  text-md font-fredoka active:bg-[#b49af9]  font-medium rounded-sm px-5 py-2.5 mr-2 mb-2"
                  onClick={handleSwapSubmit}
                >
                  <span className=" mr-3">Swap</span>
                  {loading && (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
