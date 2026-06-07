import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = "w-6 h-6", showText = false }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 800"
      className={`${className} fill-current`}
    >
      <title>0xDas brand symbol</title>
      <style>{`
        @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        .cur { animation: blink 1.1s step-end infinite; }
      `}</style>
      <rect width="800" height="800" fill="none"/>
      <text
        x="60" y="500"
        fontFamily="'Courier New', Courier, monospace"
        fontSize="340"
        fontWeight="700"
        letterSpacing="-10"
      >0x</text>
      <rect className="cur" x="598" y="168" width="148" height="332" rx="6" />
      {showText && (
        <>
          <text
            x="60" y="590"
            fontFamily="'Courier New', Courier, monospace"
            fontSize="32"
            fontWeight="400"
            opacity="0.55"
            letterSpacing="1"
          >// no funnel. just output.</text>
          <text
            x="60" y="638"
            fontFamily="'Courier New', Courier, monospace"
            fontSize="26"
            fontWeight="400"
            opacity="0.35"
            letterSpacing="2"
          >cognitive. solo. shipping.</text>
        </>
      )}
    </svg>
  );
}
