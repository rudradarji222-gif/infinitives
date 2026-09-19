const LOGO_SRC = '/assets/logo-transparent.png';

const Logo = ({ dark = false, compact = false }) => (
  <div
    className={`flex items-center ${dark ? 'rounded-2xl bg-white px-3 py-2 shadow-lg shadow-black/25' : ''}`}
    data-testid="brand-logo"
  >
    <img
      src={LOGO_SRC}
      alt="Infinitives Healthcare — Excellence in Every Dose"
      className={compact ? 'h-8 w-auto' : 'h-10 w-auto sm:h-12'}
    />
  </div>
);

export default Logo;
