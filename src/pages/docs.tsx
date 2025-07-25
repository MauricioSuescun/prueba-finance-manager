import React, { useEffect, useState } from "react";

export default function DocsPage() {
  const [swaggerJson, setSwaggerJson] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/docs/swagger.json")
      .then((res) => res.json())
      .then((data) => {
        setSwaggerJson(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el JSON de la API");
        setLoading(false);
      });
  }, []);

  const copyToClipboard = async () => {
    if (swaggerJson) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(swaggerJson, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">
        Documentación de la API
      </h1>
      <div className="mb-6 max-w-2xl text-gray-700 text-center">
        <p className="mb-4">
          Copia el siguiente JSON y pégalo en{" "}
          <a
            href="https://editor.swagger.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            editor.swagger.io
          </a>{" "}
          para visualizar e interactuar con la documentación de la API.
        </p>
        <div className="text-sm">
          <span className="font-semibold">Ruta del JSON:</span>{" "}
          <code className="bg-gray-100 px-2 py-1 rounded">
            /api/docs/swagger.json
          </code>
        </div>
      </div>
      
      {loading && (
        <div className="text-gray-600">Cargando documentación...</div>
      )}
      
      {error && (
        <div className="text-red-600 bg-red-50 p-4 rounded border border-red-200">
          {error}
        </div>
      )}
      
      {swaggerJson && (
        <div className="w-full max-w-6xl">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Especificación OpenAPI
            </h2>
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                copied
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200'
              }`}
            >
              {copied ? '¡Copiado!' : 'Copiar JSON'}
            </button>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <pre className="bg-gray-900 text-green-400 p-4 overflow-x-auto text-sm max-h-96 overflow-y-auto">
              {JSON.stringify(swaggerJson, null, 2)}
            </pre>
          </div>
          
          <div className="mt-4 text-center">
            <a
              href="https://editor.swagger.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Abrir en Swagger Editor
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
