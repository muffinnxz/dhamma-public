export default function BlessingHeader({
  header,
  filterOption,
  filterStateFunction
}: {
  header: string;
  filterOption: {
    [key: string]: boolean;
  };
  filterStateFunction: Function;
}) {

  let filters: React.ReactNode[] = [];

  for (const [key, value] of Object.entries(filterOption)) {
    filters.push(
      <>
      <input 
        type="checkbox"
        className="me-1 w-4 h-4"
        key={key}
        checked={filterOption[key]}
        onChange={(e) => {
          if (!e.currentTarget.checked && key.toLowerCase() !== "all") {
            filterStateFunction({
              ...filterOption,
              ["All"]: true,
              [key]: false,
            });
          } else {
            const tempObject = { ...filterOption };
            Object.keys(tempObject).forEach((k) => {
              tempObject[k] = (k === key) ? true : false;
            });
            filterStateFunction(tempObject);
          }
        }}
      />
      <label className="mt-[2px] me-6 text-center">{key}</label>
      </>
    )
  }

  return (
    <>
      <h2 className="text-5xl font-semibold">{header}</h2>
      <div className="flex mt-4 items-center">
        {filters}
      </div>
    </>
  );
}
