import type { OsKey } from '../data/releases';

export function AppleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M12.665 8.477c-.02-1.856 1.515-2.752 1.584-2.794-.866-1.266-2.21-1.435-2.683-1.454-1.129-.115-2.223.675-2.799.675-.586 0-1.473-.662-2.428-.643-1.23.019-2.382.73-3.013 1.835-1.301 2.253-.331 5.565.915 7.385.622.891 1.351 1.886 2.306 1.85.935-.038 1.284-.595 2.411-.595 1.116 0 1.441.595 2.418.575 1.003-.018 1.634-.895 2.238-1.794.716-1.028 1.003-2.04 1.016-2.092-.023-.01-1.946-.745-1.965-2.948ZM10.82 3.012c.502-.618.846-1.462.752-2.32-.727.031-1.635.5-2.155 1.105-.46.535-.872 1.404-.766 2.237.817.062 1.656-.413 2.169-1.022Z" />
    </svg>
  );
}

export function WindowsIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M1.5 2.84 7.3 2v5.45H1.5V2.84Zm6.55-.95L14.5 1v6.45H8.05V1.89ZM1.5 8.2h5.8v5.45L1.5 12.8V8.2Zm6.55 0h6.45v6.45l-6.45-.9V8.2Z" />
    </svg>
  );
}

export function LinuxIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.2c-1.8 0-2.9 1.4-2.9 3.5 0 .9-.4 1.9-1 2.9-.8 1.3-1.4 2.5-1.2 3.7.2.9.9 1.6 1.7 1.8.4.6 1.2 1.1 2.2 1.1.5 0 .9-.1 1.2-.3.3.2.7.3 1.2.3 1 0 1.8-.5 2.2-1.1.8-.2 1.5-.9 1.7-1.8.2-1.2-.4-2.4-1.2-3.7-.6-1-1-2-1-2.9 0-2.1-1.1-3.5-2.9-3.5Zm-1.1 3a.6.6 0 1 1 0 1.2.6.6 0 0 1 0-1.2Zm2.2 0a.6.6 0 1 1 0 1.2.6.6 0 0 1 0-1.2ZM8 5.7c.7 0 1.3.3 1.3.7 0 .3-.6.7-1.3.7s-1.3-.4-1.3-.7c0-.4.6-.7 1.3-.7Zm0 2.1c1.3 0 2.3 1.4 2.3 3.2 0 1.1-.6 1.9-1.4 2.1-.3-.2-.6-.3-.9-.3s-.6.1-.9.3c-.8-.2-1.4-1-1.4-2.1 0-1.8 1-3.2 2.3-3.2Z" />
    </svg>
  );
}

export function GitHubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function OsIcon({ os, className = 'w-4 h-4' }: { os: OsKey; className?: string }) {
  if (os === 'windows') return <WindowsIcon className={className} />;
  if (os === 'linux') return <LinuxIcon className={className} />;
  return <AppleIcon className={className} />;
}

export function CodexHostLogo({
  lightClassName = 'w-[21px] h-[24px]',
  darkClassName = 'w-6 h-6',
  alt = 'CodexHost',
}: {
  lightClassName?: string;
  darkClassName?: string;
  alt?: string;
}) {
  return (
    <>
      <img
        src="/logo.svg"
        alt={alt}
        className={`shrink-0 object-contain dark:hidden ${lightClassName}`}
      />
      <img
        src="/logo-dark.svg"
        alt={alt}
        className={`shrink-0 object-contain hidden dark:block ${darkClassName}`}
      />
    </>
  );
}
