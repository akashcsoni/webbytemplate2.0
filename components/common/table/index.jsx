import { DateTime } from "luxon";
import { useEffect } from "react";
import { ReactTabulator } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import "tabulator-tables/dist/css/tabulator.min.css";

const DynamicTable = ({
  data,
  columns,
  layout = "fitColumns",
  options = {},
}) => {

  // Effect to handle toggle children functionality for data tree
  useEffect(() => {
    if (options.dataTree) {
      const buttons = document.querySelectorAll(".toggle-children");
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const svg = button.querySelector("svg");
          const isOpen = svg.classList.toggle("open");
          button.setAttribute("aria-expanded", isOpen);
        });
      });

      // Cleanup listeners to prevent memory leaks
      return () => {
        buttons.forEach((button) => {
          button.removeEventListener("click", () => { });
        });
      };
    }
  }, []);

  return (
    <ReactTabulator
      data={data}
      columns={columns}
      resizableRows={false}
      resizableRowGuide={false}
      resizableColumnGuide={false}
      options={{
        ...options,
      }}
      columnDefaults={{
        resizable: false,
      }}
      dependencies={{
        DateTime: DateTime,
      }}
      layout={layout}
      className="tabulator container"
    />
  );
};

export default DynamicTable;
