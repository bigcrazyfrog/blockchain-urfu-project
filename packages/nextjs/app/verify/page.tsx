"use client";

import { useState } from "react";
import { ethers } from "ethers";

const abi = ["function verifyDiploma(bytes32 diplomaHash) view returns (bool)"];
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function VerifyDiploma() {
  const [hash, setHash] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async () => {
    try {
      console.log("Начало проверки диплома");
      setError(null);
      setIsSuccess(false);

      const provider = new ethers.JsonRpcProvider("http://localhost:8545");

      console.log("Подключаемся к контракту");
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const result = await contract.verifyDiploma(hash);

      console.log("Результат проверки диплома:", result);
      setIsSuccess(result);
    } catch (err: any) {
      console.error("Ошибка проверки:", err);
      setError(err.reason || err.message || "Ошибка проверки");
    }
  };

  return (
    <div>
      <input
        value={hash}
        onChange={e => setHash(e.target.value)}
        placeholder="Enter bytes32 hash"
        className="border p-2"
      />
      <button onClick={register} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
        Verify
      </button>
      {isSuccess !== null && <p>{isSuccess ? "Diplom is valid ✅" : "Diploma is invalid"}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
