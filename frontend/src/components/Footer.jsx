import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div>© {new Date().getFullYear()} Jharkhand Touristo (Made by Team Tech Bridge)</div>
      <div className="mt-2">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
      </div>
    </footer>
  );
}