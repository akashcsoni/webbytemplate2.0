import { DateTime } from "luxon";
import { useEffect, useRef } from "react";
import { ReactTabulator } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import "tabulator-tables/dist/css/tabulator.min.css";

// Global error handler to suppress Tabulator cleanup errors
if (typeof window !== 'undefined' && !window.__TABULATOR_ERROR_HANDLER_PATCHED__) {
  window.__TABULATOR_ERROR_HANDLER_PATCHED__ = true;
  
  // Store original error handler
  const originalErrorHandler = window.onerror;
  
  // Patch global error handler to suppress Tabulator cleanup errors
  window.onerror = function(message, source, lineno, colno, error) {
    // Suppress the specific ResizeTable.clearBindings error
    if (message && typeof message === 'string' && 
        message.includes('parameter 1 is not of type') &&
        message.includes('clearBindings')) {
      return true; // Suppress the error
    }
    
    // Call original error handler if it exists
    if (originalErrorHandler) {
      return originalErrorHandler.call(this, message, source, lineno, colno, error);
    }
    return false;
  };
  
  // Also patch unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && 
        typeof event.reason === 'object' &&
        event.reason.message &&
        event.reason.message.includes('parameter 1 is not of type') &&
        event.reason.message.includes('clearBindings')) {
      event.preventDefault(); // Suppress the error
    }
  });
}

const DynamicTable = ({
  id, // NEW: identify dataset source
  data,
  columns,
  layout = "fitColumns",
  options = {},
  classes = "",
}) => {
  const tabulatorRef = useRef(null);
  const containerRef = useRef(null);
  const isDestroyingRef = useRef(false);

  // Patch ResizeTable.clearBindings when component mounts
  useEffect(() => {
    // Try to patch Tabulator's ResizeTable module when it's available
    const patchResizeTable = () => {
      try {
        // Access Tabulator modules through the global scope or require
        if (typeof window !== 'undefined' && window.Tabulator) {
          const ResizeTable = window.Tabulator.modules?.ResizeTable;
          if (ResizeTable && ResizeTable.prototype && !ResizeTable.prototype.__clearBindingsPatched__) {
            const originalClearBindings = ResizeTable.prototype.clearBindings;
            ResizeTable.prototype.clearBindings = function(element) {
              try {
                // Check if element is valid before calling original method
                if (element && element.nodeType === 1 && document.body.contains(element)) {
                  return originalClearBindings.call(this, element);
                }
              } catch (error) {
                // Silently handle errors when element is missing
              }
            };
            ResizeTable.prototype.__clearBindingsPatched__ = true;
          }
        }
      } catch (e) {
        // If patching fails, continue without patch
      }
    };

    // Try patching immediately and also after a delay (in case Tabulator loads later)
    patchResizeTable();
    const timeoutId = setTimeout(patchResizeTable, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

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
    if (tabulatorRef.current && !isDestroyingRef.current) {
      tabulatorRef.current.clearData(); // optional: clear first
      tabulatorRef.current.replaceData(data); // replace with new data
    }
  }, [id]);

  // Cleanup: Manually destroy Tabulator instance before ReactTabulator's cleanup runs
  useEffect(() => {
    return () => {
      isDestroyingRef.current = true;
      
      if (tabulatorRef.current) {
        try {
          // Get the actual Tabulator instance
          const tableInstance = tabulatorRef.current.table || tabulatorRef.current;
          
          if (tableInstance && typeof tableInstance.destroy === 'function') {
            // Check if element still exists in DOM before destroying
            const element = tableInstance.element;
            if (element && element.nodeType === 1 && document.body.contains(element)) {
              try {
                // Destroy the table
                tableInstance.destroy();
              } catch (destroyError) {
                // Silently handle destroy errors - the global error handler will catch these
              }
            }
          }
        } catch (error) {
          // Silently handle all cleanup errors - the global error handler will catch these
        }
      }
    };
  }, []);

  const dummyHtml = `<div class='py-5 text-gray-700 text-base font-normal'> No data available </div>`;

  return (
    <div ref={containerRef}>
      <ReactTabulator
        ref={tabulatorRef}
        data={data}
        columns={columns}
        layout={layout}
        className={"tabulator " + classes}
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
    </div>
  );
};

export default DynamicTable;
