import React from 'react';

export const BitcoinLogo = ({ size = 32, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#F7931A"/>
      <path fill="#FFF" fillRule="nonzero" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.840-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"/>
    </g>
  </svg>
);

export const EthereumLogo = ({ size = 32, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#627EEA"/>
      <g fill="#FFF" fillRule="nonzero">
        <path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z"/>
        <path d="M16.498 4L9 16.22l7.498-3.35z"/>
        <path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z"/>
        <path d="M16.498 27.995v-6.028L9 17.616z"/>
        <path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/>
        <path fillOpacity=".602" d="M9 16.22l7.498 4.353v-7.701z"/>
      </g>
    </g>
  </svg>
);

export const SolanaLogo = ({ size = 32, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#9945FF"/>
      <g fill="#FFF">
        <path d="M5.903 20.905c.214-.214.509-.335.814-.335h18.566c.459 0 .688.555.363.879l-2.384 2.384c-.214.214-.509.335-.814.335H3.882c-.459 0-.688-.555-.363-.879l2.384-2.384z"/>
        <path d="M5.903 7.712c.214-.214.509-.335.814-.335h18.566c.459 0 .688.555.363.879L23.262 10.64c-.214.214-.509.335-.814.335H3.882c-.459 0-.688-.555-.363-.879L5.903 7.712z"/>
        <path d="M25.738 13.096c-.214-.214-.509-.335-.814-.335H6.358c-.459 0-.688.555-.363.879l2.384 2.384c.214.214.509.335.814.335h18.566c.459 0 .688-.555.363-.879l-2.384-2.384z"/>
      </g>
    </g>
  </svg>
);

export const CardanoLogo = ({ size = 32, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#0033AD"/>
      <g fill="#FFF">
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <circle cx="23.5" cy="8.5" r="1.5"/>
        <circle cx="6" cy="13" r="1"/>
        <circle cx="26" cy="13" r="1"/>
        <circle cx="6" cy="19" r="1"/>
        <circle cx="26" cy="19" r="1"/>
        <circle cx="8.5" cy="23.5" r="1.5"/>
        <circle cx="23.5" cy="23.5" r="1.5"/>
        <path d="M16 6c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm0 18c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm6-9c0-3.314-2.686-6-6-6s-6 2.686-6 6 2.686 6 6 6 6-2.686 6-6zm-6-3c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z"/>
      </g>
    </g>
  </svg>
);

export const AvalancheLogo = ({ size = 32, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#E84142"/>
      <path fill="#FFF" d="M12.191 21.5h7.619c.526 0 .857-.294.857-.735 0-.147-.021-.274-.105-.42l-3.809-6.618c-.21-.368-.42-.42-.753-.42-.315 0-.542.052-.752.42l-3.81 6.618c-.083.146-.104.273-.104.42 0 .441.331.735.857.735zm10.524-7.5h2.857c.526 0 .857-.294.857-.735 0-.147-.021-.274-.105-.42L23.048 7.42c-.21-.368-.42-.42-.753-.42-.315 0-.542.052-.752.42l-3.276 5.425c-.084.146-.105.273-.105.42 0 .441.331.735.857.735h2.857L19.952 16l1.905-3.5h.858zm-17.238 0h2.857L9.238 16l1.905-3.5h.857c.526 0 .857-.294.857-.735 0-.147-.021-.274-.105-.42L9.476 7.42c-.21-.368-.42-.42-.753-.42-.315 0-.542.052-.752.42l-3.276 5.425c-.084.146-.105.273-.105.42 0 .441.331.735.857.735z"/>
    </g>
  </svg>
);

export const PolkadotLogo = ({ size = 32, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#E6007A"/>
      <g fill="#FFF">
        <ellipse cx="16" cy="6.5" rx="3" ry="1.5"/>
        <ellipse cx="16" cy="25.5" rx="3" ry="1.5"/>
        <ellipse cx="7.5" cy="12.5" rx="1.5" ry="3" transform="rotate(60 7.5 12.5)"/>
        <ellipse cx="24.5" cy="19.5" rx="1.5" ry="3" transform="rotate(60 24.5 19.5)"/>
        <ellipse cx="7.5" cy="19.5" rx="1.5" ry="3" transform="rotate(-60 7.5 19.5)"/>
        <ellipse cx="24.5" cy="12.5" rx="1.5" ry="3" transform="rotate(-60 24.5 12.5)"/>
      </g>
    </g>
  </svg>
);

// Generic crypto logo for unknown coins
export const GenericCryptoLogo = ({ size = 32, className = "", children }: { 
  size?: number; 
  className?: string; 
  children: React.ReactNode;
}) => (
  <div 
    className={`flex items-center justify-center rounded-full bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold ${className}`}
    style={{ width: size, height: size, fontSize: size * 0.4 }}
  >
    {children}
  </div>
);

// Component to get the appropriate logo
export const getCryptoLogo = (symbol: string, size: number = 32, className: string = "") => {
  switch (symbol.toUpperCase()) {
    case 'BTC':
    case 'BITCOIN':
      return <BitcoinLogo size={size} className={className} />;
    case 'ETH':
    case 'ETHEREUM':
      return <EthereumLogo size={size} className={className} />;
    case 'SOL':
    case 'SOLANA':
      return <SolanaLogo size={size} className={className} />;
    case 'ADA':
    case 'CARDANO':
      return <CardanoLogo size={size} className={className} />;
    case 'AVAX':
    case 'AVALANCHE':
      return <AvalancheLogo size={size} className={className} />;
    case 'DOT':
    case 'POLKADOT':
      return <PolkadotLogo size={size} className={className} />;
    default:
      return <GenericCryptoLogo size={size} className={className}>{symbol.charAt(0)}</GenericCryptoLogo>;
  }
};