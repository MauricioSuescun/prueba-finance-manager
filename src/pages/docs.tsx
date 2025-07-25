import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SwaggerUI = dynamic<any>(() => import("swagger-ui-react"), { ssr: false });

export default function DocsPage() {
  const [swaggerJson, setSwaggerJson] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">
        Documentación de la API
      </h1>
      <div className="mb-6 max-w-2xl text-gray-700 text-center">
        <p>
          Puedes copiar el siguiente JSON y pegarlo en{" "}
          <a
            href="https://editor.swagger.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            editor.swagger.io
          </a>{" "}
          para visualizar e interactuar con la documentación de la API.
          <br />
          <span className="font-semibold">Ruta del JSON:</span>{" "}
          <code className="bg-gray-100 px-2 py-1 rounded">
            /api/docs/swagger.json
          </code>
        </p>
      </div>
      {loading && <div>Cargando documentación...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {swaggerJson && (
        <div className="w-full max-w-4xl mb-8">
          <SwaggerUI spec={swaggerJson} />
        </div>
      )}
      {swaggerJson && (
        <pre className="bg-gray-100 p-4 rounded w-full max-w-4xl overflow-x-auto text-xs text-gray-800 border border-gray-200">
          {JSON.stringify(swaggerJson, null, 2)}
        </pre>
      )}
    </main>
  );
}
