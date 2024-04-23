export default function Header({
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
          className="me-1 w-4 h-4"
          type="checkbox"
          key={key}
          checked={filterOption[key]}
          onChange={(e) => {
            if (!e.currentTarget.checked && key !== "All") {
              let isAllFalse = true;
              for (const [k, v] of Object.entries(filterOption)) {
                if (k !== key && v) {
                  isAllFalse = false;
                }
              }
              if (isAllFalse) {
                filterStateFunction({
                  ...filterOption,
                  ["All"]: true,
                  [key]: e.currentTarget.checked
                });
              } else {
                filterStateFunction({
                  ...filterOption,
                  [key]: e.currentTarget.checked
                });
              }
            } else if (key === "All") {
              let tempObj = { ...filterOption };
              Object.keys(tempObj).forEach((k) => {
                tempObj[k] = k === "All" ? true : false;
              });
              filterStateFunction(tempObj);
            } else if (key === "Blessed") {
              filterStateFunction({
                ...filterOption,
                ["Not Blessed"]: false,
                [key]: e.currentTarget.checked,
                ["All"]: false,
                ["Pending"]: false,
                ["Paid"]: false,
                ["Delivering"]: false,
                ["Received"]: true
              });
            } else if (key === "Not Blessed") {
              filterStateFunction({
                ...filterOption,
                ["Blessed"]: false,
                [key]: e.currentTarget.checked,
                ["All"]: false
              });
            } else {
              filterStateFunction({
                ...filterOption,
                ["All"]: false,
                ["Blessed"]: false,
                [key]: e.currentTarget.checked
              });
            }
          }}
        />
        <label className="mt-[2px] me-6 text-center">{key}</label>
      </>
    );
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
