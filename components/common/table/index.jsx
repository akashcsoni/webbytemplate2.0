import { DateTime } from "luxon";
import { useEffect, useRef } from "react";
import { ReactTabulator } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import "tabulator-tables/dist/css/tabulator.min.css";

const DynamicTable = ({
  data,
  columns,
  layout = "fitColumns",
  options = {},
  classes = "",
  loading = false,
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

  useEffect(() => {
    return () => {
      if (tabulatorRef.current) {
        try {
          tabulatorRef.current.destroy(); // Safe destroy
        } catch (e) {
          console.warn("Tabulator destroy failed:", e);
        }
      }
    };
  }, [data]);

  const dummyHtml = `<div class='py-5 text-gray-700 text-base font-normal'> No data available </p> </div>`;

  if (loading && data?.length === 0) {
    return (
      <div className="p-4">
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-100 bg-white text-sm">
            <tbody className="divide-y divide-gray-100">
              {[...Array(9)].map((_, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-64 bg-gray-100 animate-pulse rounded mb-1" />
                    <div className="h-4 w-56 bg-gray-100 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-8 w-20 bg-gray-100 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-8 w-28 bg-gray-100 animate-pulse rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-20 bg-gray-100 animate-pulse rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

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
