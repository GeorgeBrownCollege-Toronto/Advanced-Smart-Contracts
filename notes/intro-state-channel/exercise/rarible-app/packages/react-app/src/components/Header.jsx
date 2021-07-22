import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <div>
      <PageHeader title="Rarible app" style={{ cursor: "pointer" }} />
    </div>
  );
}
