import Link from "next/link";
import "./styles.css";

export default function SuccessPage() {
  return (
    <div className="container">
      <div className="card success-card">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>

        <h1 className="success-title">Диплом успешно зарегистрирован</h1>
        <p className="success-text">
          Проверить статус можно на странице{" "}
          <Link href="/verify" className="success-link">
            /verify
          </Link>
        </p>

        <div className="success-actions">
          <Link href="/" className="success-btn">
            <svg viewBox="0 0 24 24" className="home-icon" width="24" height="24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
