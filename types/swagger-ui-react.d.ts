declare module "swagger-ui-react" {
  import * as React from "react";
  export interface SwaggerUIProps {
    spec: Record<string, unknown>;
    [key: string]: unknown;
  }
  const SwaggerUI: React.FC<SwaggerUIProps>;
  export default SwaggerUI;
}
