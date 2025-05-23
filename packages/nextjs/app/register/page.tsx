"use client";

import { useState } from "react";
import { BrowserProvider, Contract } from "ethers";

const abi = [
  "function registerDiploma(bytes32 diplomaHash, string memory studentName) external",
  "event DiplomaRegistered(bytes32 indexed diplomaHash, address indexed issuer)",
];
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// const TEST_DIPLOMA_DATA = {
//   hash: "0x5fbdbe2315678afecb367f032d93f642f64180aa334343434343434343434343",
//   studentName: "Иванов Иван Иванович"
// };

export default function DiplomaRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const [studentName, setStudentName] = useState("");
  const [hash, setHash] = useState("");

  const register = async () => {
    try {
      console.log("Регистрация диплома...");
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);
      setTxHash(null);

      if (!window.ethereum) {
        throw new Error("MetaMask не установлен");
      }

      console.log("Подключаемся к MetaMask");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      console.log("Подключаемся к контракту");
      const contract = new Contract(contractAddress, abi, signer);

      const tx = await contract.registerDiploma(hash, studentName);

      console.log("Транзакция отправлена, хэш:", tx.hash);
      setTxHash(tx.hash);

      console.log("Ожидаем подтверждения...");
      await tx.wait();

      console.log("Диплом успешно зарегистрирован");
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Ошибка регистрации:", err);
      setError(err.reason || err.message || "Ошибка регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Регистрация диплома</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Имя студента:
          <br />
          <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} />
        </label>
        <br />
        <br />
        <label>
          Хэш диплома (bytes32):
          <br />
          <input type="text" value={hash} onChange={e => setHash(e.target.value)} placeholder="0x..." />
        </label>
      </div>

      <button onClick={register} disabled={isLoading}>
        {isLoading ? "Регистрация..." : "Зарегистрировать диплом"}
      </button>

      {isSuccess && (
        <div style={{ marginTop: "20px", color: "green" }}>
          <p>✅ Диплом успешно зарегистрирован!</p>
          {txHash && <p>Хэш транзакции: {txHash}</p>}
        </div>
      )}

      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <p>Ошибка: {error}</p>
        </div>
      )}
    </div>
  );
}
