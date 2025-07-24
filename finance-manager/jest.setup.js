import "@testing-library/jest-dom";
import "next-router-mock";
if (!global.fetch) {
  global.fetch = (input) => {
    if (typeof input === "string" && input.includes("/api/movements")) {
      return Promise.resolve({
        ok: true,
        json: async () => [],
        text: async () => "[]",
      });
    }
    return Promise.resolve({
      ok: true,
      json: async () => ({}),
      text: async () => "",
    });
  };
}
