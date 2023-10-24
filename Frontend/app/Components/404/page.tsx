import Link from 'next/link';
import './style.css'

export default function Custom404() {
  return (
    <div className="error-container">
      <h1 className="error-heading">404 - Page Not Found</h1>
      <p>The page you are looking for does not exist. make sure <Link className="error-link" href='http://localhost:3001/data/data.json'>this</Link> is online</p>
      <Link href="/dashboard" className="error-link">Go back to the Dashboard</Link>
    </div>
  );
};

