import React from 'react';

const ICONS: Record<string, React.ReactElement> = {
  JavaScript: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#f7df1e" d="M0 0h24v24H0z"/><path d="M13.2 14.89c.39-.24.65-.64.65-1.13c0-.49-.26-.89-.65-1.13c-.39-.24-.92-.36-1.57-.36h-1.03v2.98h1.1c.58 0 1.08-.12 1.5-.46m-1.2-4.02c.98 0 1.74.33 2.27.98c.53.65.8 1.5.8 2.54c0 1.05-.27 1.9-.8 2.55c-.53.65-1.29.98-2.27.98h-2.13V9.33h2.13M8.9 13.78v-1.83h-1.63v-1.54h3.72v1.54h-1.62v1.83h1.62v1.54H7.27v-1.54z"/></svg>,
  TypeScript: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#3178c6" d="M0 0h24v24H0z"/><path d="M12.5 11.2h-1v2.1h1c.8 0 1.3-.5 1.3-1.1s-.5-1-1.3-1m5.1-1.8v1.4h.8v1.3h-.8v1.3h1v1.4h-2.6V9.4h2.5M10.7 9.4l-1.5 4.3h-.7l-1.4-4.3H5.6l2.3 6.7h1.6l2.4-6.7h-1.2M13.2 9.33c.98 0 1.74.33 2.27.98c.53.65.8 1.5.8 2.54c0 1.05-.27 1.9-.8 2.55c-.53.65-1.29.98-2.27.98h-2.13V9.33h2.13" fill="#fff"/></svg>,
  Python: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#3776ab" d="M21.4 17.5c0 2.2-1.8 4-4 4s-4-1.8-4-4V13h2.1v4.5c0 1.1.9 2 2 2s2-.9 2-2V13h4v4.5zM2.6 6.5C2.6 4.3 4.4 2.5 6.6 2.5s4 1.8 4 4V11H8.5V6.5c0-1.1-.9-2-2-2s-2 .9-2 2V11H2.5V6.5zm8.1-1.8c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5m6.2 12.6c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5c0-.8.7-1.5 1.5-1.5" /><path fill="#ffd43b" d="M17.4 17.5c0 2.2-1.8 4-4 4s-4-1.8-4-4V13h2.1v4.5c0 1.1.9 2 2 2s2-.9 2-2V13h4v4.5zM6.6 2.5c2.2 0 4 1.8 4 4V11H8.5V6.5c0-1.1-.9-2-2-2s-2 .9-2 2V11H2.5V6.5C2.5 4.3 4.3 2.5 6.6 2.5m-1.5 1.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5m12.6 6.2c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5"/></svg>,
  Java: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#f44336" d="M12 18.9c-.3 0-.6-.1-.9-.2l-5-2.8c-.6-.3-1-.9-1-1.6V9.6c0-.7.4-1.3 1-1.6l5-2.8c.6-.3 1.2-.3 1.8 0l5 2.8c.6.3 1 .9 1 1.6v5.7c0 .7-.4 1.3-1 1.6l-5 2.8c-.3.1-.6.2-.9.2z"/><path fill="#fff" d="M12.1 11.2h-.9v2.1h.9c.8 0 1.3-.5 1.3-1.1s-.4-1-1.3-1m5.6 1.1c0-.4-.1-.8-.3-1.1s-.4-.5-.7-.7c-.3-.1-.6-.2-1-.2s-.7.1-1 .2c-.3.1-.6.3-.8.5l.6 1c.1-.1.3-.2.4-.3c.2-.1.3-.1.5-.1c.2 0 .4.1.5.2c.1.1.2.3.2.5s-.1.4-.2.5c-.1.1-.3.2-.5.2c-.2 0-.4-.1-.5-.1c-.2-.1-.3-.2-.4-.3l-.6 1c.2.2.5.4.8.5c.3.1.7.2 1 .2c.4 0 .7-.1 1-.2c.3-.1.6-.3.7-.6c.2-.3.3-.6.3-1m-7.1 2.4l1.3-4.3h1.3l-2.1 6.7h-1.6l-2.1-6.7h1.6l1.3 4.3z"/></svg>,
  Go: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#00add8" d="M12.1 11.2h-1v2.1h1c.8 0 1.3-.5 1.3-1.1s-.5-1-1.3-1m6.6-4c-.7-.3-1.5-.4-2.3-.4c-1.2 0-2.3.4-3.2 1.1c-.9.7-1.5 1.7-1.7 2.8c-.2 1.1 0 2.2.6 3.1c.6.9 1.5 1.5 2.6 1.7c1.1.2 2.2 0 3.1-.6c.9-.6 1.5-1.5 1.7-2.6c.2-1.1 0-2.2-.6-3.1c-.5-.8-1.3-1.3-2.2-1.6m-1.2 5.9c-.3.2-.6.3-1 .3s-.7-.1-1-.3c-.3-.2-.5-.5-.6-.8c-.1-.3-.1-.7.1-1c.1-.3.4-.6.7-.7c.3-.2.6-.3 1-.3s.7.1 1 .3c.3.2.5.5.6.8c.1.3.1.7-.1 1c-.1.3-.4.5-.7.7m-8.1-1.9l2.8-2.8V5.6H5.6v2.8l2.8 2.8L5.6 14v2.8h2.8v-2.8z"/></svg>,
  Rust: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.8 11.3v1.4h2.1v2.8h-2.1v1.4h-1.4v-1.4h-2.1v-2.8h2.1v-1.4h1.4m-1.4-2.8v1.4h-1.4V8.5h4.9v1.4h-2.1v1.4m-4.2 8.4h-1.4v-2.8H9.7v1.4H8.3v1.4H4.1V17H7V8.5h1.4v7.1h3.1m-.3-8.5H5.5V5.7h8.4v1.4h-1.4V8.5h-1.4z"/></svg>,
  'C#': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#68217a" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2zm4.1 12.9h-1.4l-1-1h-3.4l-1 1H8.9l2.9-7.8h.4l2.9 7.8zm-3.1-2.4l-1.1-3l-1.1 3h2.2zm-6.6 2.4V8.5h-1v-1h3.1v1h-1v5.4h3.1v1H8.5v-1z"/></svg>,
  'C++': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#00599c" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2z"/><path fill="#fff" d="M10.1 14.3c-.8.8-1.8 1.2-3.1 1.2c-1.3 0-2.3-.4-3.1-1.2s-1.2-1.8-1.2-3.1c0-1.3.4-2.3 1.2-3.1s1.8-1.2 3.1-1.2c1.3 0 2.3.4 3.1 1.2c.8.8 1.2 1.8 1.2 3.1c0 1.3-.4 2.3-1.2 3.1zm-1-5.3c-.5-.5-1.1-.7-1.9-.7s-1.4.2-1.9.7s-.7 1.1-.7 1.9s.2 1.4.7 1.9s1.1.7 1.9.7s1.4-.2 1.9-.7s.7-1.1.7-1.9s-.2-1.4-.7-1.9zm8.5 4.3h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1zm-2.5-3.5h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1z"/></svg>,
  HTML: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#e34f26" d="m12 18.2l-4-1.2V9.2h8v7.8zm-2.8-7.8v1.6h2.7v-1.6zm0 3.2v1.6h2.6l-.3 1.2l-2.3.6v1.7l4-1.2v-5.1z"/><path fill="#f16529" d="m12 9.2v10.3l4-1.2V9.2zm3.3 4.4h-3.3v1.6h1.5l-.2 1l-1.3.3v1.7l2.8-.7v-3.9z"/></svg>,
  CSS: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#1572b6" d="m12 18.2l-4-1.2V9.2h8v7.8zm-2.8-7.8v1.6h2.7v-1.6zm0 3.2v1.6h2.6l-.3 1.2l-2.3.6v1.7l4-1.2v-5.1z"/><path fill="#33a9dc" d="m12 9.2v10.3l4-1.2V9.2zm3.3 4.4h-3.3v1.6h1.5l-.2 1l-1.3.3v1.7l2.8-.7v-3.9z"/></svg>,
  PHP: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#777bb4"/><text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="sans-serif" dy=".1em">php</text></svg>,
  Ruby: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#cc342d" d="M18.8 12.3c0-1.7-1.4-3-3-3s-3 1.4-3 3s1.4 3 3 3s3-1.4 3-3m-1.2 0c0 .9-.8 1.7-1.8 1.7s-1.8-.8-1.8-1.7s.8-1.7 1.8-1.7s1.8.8 1.8 1.7M8.3 5.7h7.4l2.1 3.2l-5.8 8.4l-5.8-8.4z"/></svg>,
  SQL: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>,
};

const DefaultIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
  </svg>
);


interface LanguageIconProps {
  language: string;
  className?: string;
}

const LanguageIcon: React.FC<LanguageIconProps> = ({ language, className = 'h-8 w-8' }) => {
  const IconComponent = ICONS[language] || DefaultIcon;
  return React.cloneElement(IconComponent, { className: `${className} text-gray-400` });
};

export default LanguageIcon;
