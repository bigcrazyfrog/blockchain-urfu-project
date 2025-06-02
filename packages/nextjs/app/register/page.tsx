"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./styles.css";
import { BrowserProvider, Contract, keccak256 } from "ethers";

const abi = [
  "function registerDiploma(bytes32 diplomaHash, string memory studentName) external",
  "event DiplomaRegistered(bytes32 indexed diplomaHash, address indexed issuer)",
];
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function DiplomaRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const router = useRouter();

  const [studentName, setStudentName] = useState("");
  const [hash, setHash] = useState("");

  if (!contractAddress) return null;

  const register = async () => {
    try {
      console.log("Регистрация диплома...");
      setIsLoading(true);
      setError(null);

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

      console.log("Ожидаем подтверждения...");
      await tx.wait();

      console.log("Диплом успешно зарегистрирован");

      router.push("/success");
    } catch (err: any) {
      console.error("Ошибка регистрации:", err);
      setError(err.reason || err.message || "Ошибка регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFileName("");
      return;
    }

    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const fileHash = keccak256(bytes);
      console.log("PDF-хэш:", fileHash);
      setHash(fileHash);
    } catch (err) {
      console.error("Ошибка при чтении файла:", err);
      setError("Ошибка при чтении PDF-файла");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Регистрация нового диплома</h1>
        <div className="form-group">
          <label htmlFor="course-name" className="form-label">
            Название курса
          </label>
          <input type="text" id="course-name" className="form-input" placeholder="Введите название курса" />
        </div>

        <div className="form-group">
          <label htmlFor="recipient" className="form-label">
            Кому выдается
          </label>
          <input
            type="text"
            id="recipient"
            className="form-input"
            placeholder="ФИО студента"
            value={studentName}
            onChange={e => setStudentName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="completion-date" className="form-label">
            Дата окончания курса
          </label>
          <input type="date" id="completion-date" className="form-input" />
        </div>

        <div className="form-group">
          <label htmlFor="diploma-file" className="form-label">
            Загрузить PDF файл диплома
          </label>
          <div className="file-upload">
            <input
              type="file"
              id="diploma-file"
              accept="application/pdf"
              className="file-input"
              onChange={handleFileUpload}
            />
            <label htmlFor="diploma-file" className="file-label">
              <svg className="file-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                <path d="M14 2v6h6M12 18v-6M9 15h6" />
              </svg>
              <span>{fileName || "Выберите файл"}</span>
            </label>

            {fileName == "" && <span className="file-name">Файл не выбран</span>}
          </div>
        </div>
        <button className="submit-btn" onClick={register} disabled={isLoading}>
          {isLoading ? "Регистрация..." : "Зарегистрировать диплом"}
        </button>
      </div>
      {error != null && (
        <div className="error-container" id="error-container">
          <div className="error-content">
            <svg className="error-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <p className="error-message" id="error-message">
              Ошибка: {error}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
