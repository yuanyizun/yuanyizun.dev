import { ImageResponse } from "next/og";

export function interviewAppIcon(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#252c24",
          color: "#f7f5f0",
          padding: Math.round(size * 0.14),
          fontSize: Math.round(size * 0.18),
          fontWeight: 650,
        }}
      >
        <div
          style={{
            display: "flex",
            width: Math.round(size * 0.18),
            height: Math.round(size * 0.035),
            backgroundColor: "#bb4b2c",
            marginBottom: Math.round(size * 0.08),
          }}
        />
        Interview
      </div>
    ),
    { width: size, height: size },
  );
}
