'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import Link from 'next/link';

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">API Dokumentacija</h1>
          <Link href="/" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">
            ← Nazad na početnu
          </Link>
        </div>
      </div>
      <div className="p-4">
        <SwaggerUI url="/api/docs" />
      </div>
    </div>
  );
}
