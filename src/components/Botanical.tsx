import type { Variety } from "../data";

function Meadow() {
  return (
    <g>
      <path d="M116 396c-3-82 17-179 18-303M117 351c-15-54-47-106-77-127M127 257c33-38 59-84 73-127M134 203c-16-38-26-77-25-114M133 173c34-19 59-45 68-70" />
      <path d="M118 346c-17-54-72-45-82-80 42 6 68 22 82 80ZM124 294c12-39 62-29 83-65-3 39-41 61-83 65ZM133 194c-37-8-58-41-50-66 22 11 40 33 50 66Z" />
      <g>
        {[
          [134, 80],
          [109, 69],
          [202, 98],
          [204, 125],
          [35, 215],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r="6" />
            {Array.from({ length: 9 }, (_, j) => (
              <ellipse
                key={j}
                cx="0"
                cy="-15"
                rx="4"
                ry="10"
                transform={`rotate(${j * 40})`}
              />
            ))}
          </g>
        ))}
      </g>
      <path d="M142 397c39-92 60-130 99-179m-97 163 55-116m-20 43 11-2m-20 18 11-2m-25 27 12-2" />
    </g>
  );
}

function Linden() {
  return (
    <g>
      <path d="M70 391c32-120 76-190 125-271M126 253c-24-32-40-56-49-95M161 193c25-35 48-39 76-45M174 160c-12-47-9-80 1-104" />
      <path d="M137 237c-69-18-87-80-47-100 50-9 79 48 47 100ZM167 193c62 4 103-39 87-81-45-26-105 13-87 81ZM178 150c-49-35-51-89-17-105 47-2 68 49 17 105Z" />
      <path d="m92 146 42 78m53-42 58-53m-76-74 7 83M125 183l-26-4m130-35-23-2" />
      <path d="M132 233c-23 32-32 47-42 71M169 197c25 16 34 39 38 73" />
      <g>
        {[
          [89, 312],
          [72, 300],
          [104, 290],
          [211, 278],
          [225, 265],
          [195, 269],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r="4" />
            {Array.from({ length: 5 }, (_, j) => (
              <ellipse
                key={j}
                cx="0"
                cy="-9"
                rx="4"
                ry="7"
                transform={`rotate(${j * 72})`}
              />
            ))}
          </g>
        ))}
      </g>
    </g>
  );
}

function Buckwheat() {
  return (
    <g>
      <path d="M122 398c-8-92-13-188 15-318M119 333c-47-46-65-87-69-130M119 276c61-33 89-77 94-119M125 203c-27-43-37-78-34-111" />
      <path d="M116 321 53 285l-8-48 69 57ZM122 268l54-74 50-2-62 65ZM126 213l-48-50 13-28 36 58Z" />
      <g>
        {[
          [133, 87],
          [153, 64],
          [111, 67],
          [144, 47],
          [92, 85],
          [86, 109],
          [214, 151],
          [231, 135],
          [199, 127],
          [49, 192],
          [30, 177],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r="3" />
            {Array.from({ length: 5 }, (_, j) => (
              <ellipse
                key={j}
                cx="0"
                cy="-8"
                rx="3"
                ry="5"
                transform={`rotate(${j * 72})`}
              />
            ))}
          </g>
        ))}
      </g>
      <path d="m117 187 15-67m47 73 31-35M53 261l-3-44" />
    </g>
  );
}

function Cream() {
  return (
    <g>
      <path d="M130 394c-17-100-9-190 22-310m-18 234 63-93m-65 58-63-79m63 46 44-128M127 225l-43-98" />
      {Array.from({ length: 11 }, (_, i) => (
        <g
          key={i}
          transform={`translate(${148 + i * 0.8} ${87 + i * 12}) rotate(${i * 3 - 18})`}
        >
          <path d="M0 0c-21-3-25-17-14-21C-4-18-1-7 0 0Zm1 3c23-2 27-14 17-21C7-14 3-4 1 3Z" />
        </g>
      ))}
      <path d="M76 205c-18-4-32-13-32-26 15-1 25 9 32 26Zm111 34c20-10 27-23 23-36-14 5-23 18-23 36Z" />
    </g>
  );
}

export function Botanical({
  variety = "meadow",
  className = "",
}: {
  variety?: Variety;
  className?: string;
}) {
  return (
    <svg
      className={`botanical ${className}`}
      viewBox="0 0 280 420"
      fill="none"
      stroke="currentColor"
      strokeWidth=".9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {variety === "meadow" ? (
        <Meadow />
      ) : variety === "linden" ? (
        <Linden />
      ) : variety === "buckwheat" ? (
        <Buckwheat />
      ) : (
        <Cream />
      )}
    </svg>
  );
}
