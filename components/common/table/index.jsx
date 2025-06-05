import { DateTime } from "luxon";
import { useEffect, useRef } from "react";
import { ReactTabulator } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import "tabulator-tables/dist/css/tabulator.min.css";

const DynamicTable = ({
  id, // NEW: identify dataset source
  data,
  columns,
  layout = "fitColumns",
  options = {},
  classes = "",
}) => {
  const tabulatorRef = useRef(null);

  useEffect(() => {
    if (!options.dataTree) return;

    const handleToggle = (event) => {
      const svg = event.currentTarget.querySelector("svg");
      if (svg) {
        const isOpen = svg.classList.toggle("open");
        event.currentTarget.setAttribute("aria-expanded", isOpen);
      }
    };

    const buttons = document.querySelectorAll(".toggle-children");
    buttons.forEach((button) => {
      button.addEventListener("click", handleToggle);
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("click", handleToggle);
      });
    };
  }, [options.dataTree]);

  // 🆕 Reset table when ID changes
  useEffect(() => {
    if (tabulatorRef.current) {
      tabulatorRef.current.clearData(); // optional: clear first
      tabulatorRef.current.replaceData(data); // replace with new data
    }
  }, [id]);

  const dummyHtml = `<div class='py-5 text-gray-700 text-base font-normal'> No data available </div>`;

  return (
    <ReactTabulator
      ref={tabulatorRef}
      data={data}
      columns={columns}
      layout={layout}
      className={"tabulator container " + classes}
      options={{
        ...options,
        placeholder: dummyHtml,
        pagination: true,
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [true],
        paginationCounter: "rows",
      }}
      columnDefaults={{ resizable: false }}
      dependencies={{ DateTime }}
      resizableRows={false}
      resizableRowGuide={false}
      resizableColumnGuide={false}
    />
  );
};

export default DynamicTable;
