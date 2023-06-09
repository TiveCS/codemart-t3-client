interface Props {
  children?: React.ReactNode;
}

const SearchIcon: React.FC<Props> = () => {
  return (
    <>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.4167 24.5C19.5379 24.5 24.5 19.5379 24.5 13.4167C24.5 7.29555 19.5379 2.33337 13.4167 2.33337C7.29555 2.33337 2.33337 7.29555 2.33337 13.4167C2.33337 19.5379 7.29555 24.5 13.4167 24.5Z"
          stroke="#0087FD"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25.6667 25.6667L23.3334 23.3334"
          stroke="#0087FD"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

export default SearchIcon;
