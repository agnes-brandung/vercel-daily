import type { SVGProps } from 'react';

const LoadingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <path
      fill="#E3E3DF"
      fillRule="evenodd"
      d="M1.5 12C1.5 6.201 6.201 1.5 12 1.5S22.5 6.201 22.5 12 17.799 22.5 12 22.5 1.5 17.799 1.5 12M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12c0 1.292.233 2.53.66 3.673l2.764-1.18A7.5 7.5 0 0 1 12 4.5z"
      clipRule="evenodd"
    />
  </svg>
);
export default LoadingIcon;
