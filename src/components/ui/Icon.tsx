import React from 'react';

const ICON_PATHS: Record<string, string> = {
  shield: '<path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z"/>',
  "shield-check": '<path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z"/><path d="M9 11.5l2 2 4-4"/>',
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  fingerprint: '<path d="M12 11a2 2 0 0 1 2 2c0 2-.3 4-1 5.5"/><path d="M8.5 8.2A5 5 0 0 1 17 12c0 1-.1 2-.3 3"/><path d="M6 12a6 6 0 0 1 9.6-4.8"/><path d="M9 19c.7-1.3 1-3 1-5a2 2 0 0 1 .3-1"/><path d="M19 13c0 3-.5 5.5-1.2 7.2"/>',
  breach: '<path d="M12 3l9 16H3z"/><path d="M12 10v4"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  sparkles: '<path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z"/><path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 4l3 3-2.5 2.5L14 7"/>',
  kanban: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="10" rx="1.5"/><rect x="17" y="4" width="4" height="13" rx="1.5"/>',
  building: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 5 1.5 6.5 2 7H4c.5-.5 2-2 2-7z"/><path d="M10.5 20a1.7 1.7 0 0 0 3 0"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.4 2.6a7 7 0 0 0-1.7 1l-2.3-1-2 3.4L3 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 1.7 1l.4 2.6h5l.4-2.6a7 7 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5a7 7 0 0 0 .1-1z"/>',
  check: '<path d="M5 12l5 5 9-11"/>',
  "check-circle": '<circle cx="12" cy="12" r="9"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
  "chevron-right": '<path d="M9 6l6 6-6 6"/>',
  "chevron-down": '<path d="M6 9l6 6 6-6"/>',
  external: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  "eye-off": '<path d="M3 3l18 18"/><path d="M10.6 6.2A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3 3.6"/><path d="M6.3 6.7A16 16 0 0 0 2 12s3.5 7 10 7a9.5 9.5 0 0 0 4-.9"/><path d="M9.5 10.5a3 3 0 0 0 4 4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  "trending-up": '<path d="M3 17l6-6 4 4 8-8"/><path d="M21 7h-5M21 7v5"/>',
  "trending-down": '<path d="M3 7l6 6 4-4 8 8"/><path d="M21 17h-5M21 17v-5"/>',
  alert: '<path d="M12 3l9 16H3z"/><path d="M12 9v5"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
  trash: '<path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 16h6"/>',
  mask: '<path d="M4 7c0-1 1-2 3-2s3 1 5 1 3-1 5-1 3 1 3 2v3c0 4-3 7-8 8-5-1-8-4-8-8z"/><circle cx="9" cy="11" r="1.2" fill="currentColor"/><circle cx="15" cy="11" r="1.2" fill="currentColor"/>',
  send: '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>',
  logout: '<path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  phone: '<path d="M5 4h3l2 5-2 1c1 2 2.5 3.5 4.5 4.5l1-2 5 2v3c0 1-.8 1.8-1.8 1.7C10 21 3 14 3.3 5.8 3.4 4.8 4 4 5 4z"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
  scan: '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M4 12h16"/>',
  flag: '<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
  undo: '<path d="M3 7v6h6M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
};

interface IconProps {
  name: string;
  size?: number;
  stroke?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 18, stroke = 1.75, style, className }) => {
  const path = ICON_PATHS[name] || ICON_PATHS["shield"];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: path }}
    />
  );
};
