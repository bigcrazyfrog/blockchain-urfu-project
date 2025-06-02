"use client";

import { useState } from "react";
import "./styles.css";
import { ethers } from "ethers";
import { keccak256 } from "ethers";

const abi = [
  "function getDiplomaInfo(bytes32 diplomaHash) external view returns (address issuer, uint256 timestamp, string memory student)",
];
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

export default function VerifyDiploma() {
  const [hash, setHash] = useState("");
  const [isLoad, setIsLoad] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const [studentName, setStudentName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");

  if (!contractAddress) return null;

  const verify = async () => {
    try {
      console.log("Начало проверки диплома");
      setError(null);
      setIsLoad(false);

      const provider = new ethers.JsonRpcProvider(rpcUrl);

      console.log("Подключаемся к контракту");
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const result = await contract.getDiplomaInfo(hash);
      console.log("Результат проверки диплома:", result);

      setIssuer(result.issuer);
      setStudentName(result.student);
      const date = new Date(Number(result.timestamp) * 1000);
      setIssueDate(date.toLocaleString("ru-RU"));

      setIsLoad(true);
    } catch (err: any) {
      console.error("Ошибка проверки:", err);
      setError(err.reason || err.message || "Ошибка проверки");
      setIsLoad(false);
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
        <h1 className="title">Проверка подлинности диплома</h1>

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

            <div className="verification-section">
              <button className="submit-btn" onClick={verify}>
                {"Проверить диплом"}
              </button>
            </div>
          </div>
        </div>
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

      {error == null && isLoad == true && (
        <div className="diploma-container">
          <div className="diploma-header">
            <h2>Информация о дипломе</h2>
            <div className="diploma-status verified">
              <svg viewBox="0 0 24 24" className="status-icon" width="24" height="24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Подтвержден
            </div>
          </div>

          <div className="diploma-details">
            <div className="detail-row">
              <span className="detail-label">ФИО студента:</span>
              <span className="detail-value" id="student-name">
                {studentName || "---"}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Кем зарегистрирован:</span>
              <span className="detail-value" id="registrar-name">
                {issuer || "---"}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Дата регистрации:</span>
              <span className="detail-value" id="registration-date">
                {issueDate || "---"}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Код диплома:</span>
              <span className="detail-value diploma-code" id="diploma-code">
                {hash || "---"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
