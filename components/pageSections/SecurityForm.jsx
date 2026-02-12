"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";

const SecurityForm = ({ button }) => {
  const [saveLoading, setSaveLoading] = useState(false);

  const securityFields = [];

  const saveSecurityInformation = async (event) => {
    event.preventDefault();
    setSaveLoading(true);

    // Placeholder for security fields validation
    const isValid = true;

    if (!isValid) {
      setSaveLoading(false);
      return;
    }

    // Placeholder for security fields save logic
    setTimeout(() => {
      toast.success("No changes detected in Security settings.");
      setSaveLoading(false);
    }, 500);
  };



  return (
    <div className="border border-primary/10 rounded-md overflow-hidden mb-[20px] bg-white">
      <div className="flex items-center justify-between sm:flex-nowrap flex-wrap gap-1.5 w-full border-b border-primary/10 sm:px-5 px-3 py-[6px] bg-white overflow-hidden">
        <p className="text-black">Security</p>
      </div>
      <div className="sm:py-6 py-4 sm:px-5 px-4">
        <form onSubmit={saveSecurityInformation} className="mb-8">
          <div className="flex flex-wrap">
            {securityFields.length > 0 ? (
              securityFields
                .sort((a, b) => a.position - b.position)
                .map((data, index) => (
                  <div key={`security-field-${index}`} className={data.class}>
                    {/* Security fields will be rendered here when added */}
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-sm">Security settings will be available soon.</p>
            )}
          </div>
          {button && (
            <Button
              type="submit"
              disabled={saveLoading}
              className="group btn btn-primary flex items-center justify-center gap-[10px] w-[220px] xl:!py-[11px] py-[10px] h-auto sm:mt-5 mt-3"
            >
              {saveLoading && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 50 50"
                  fill="none"
                >
                  <circle cx="40" cy="25" r="3" fill="currentColor">
                    <animate
                      attributeName="opacity"
                      values="1;0.2;1"
                      dur="1.2s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="37.99038105676658" cy="32.5" r="3" fill="currentColor">
                    <animate
                      attributeName="opacity"
                      values="1;0.2;1"
                      dur="1.2s"
                      begin="0.1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="32.5" cy="37.99038105676658" r="3" fill="currentColor">
                    <animate
                      attributeName="opacity"
                      values="1;0.2;1"
                      dur="1.2s"
                      begin="0.2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="25" cy="40" r="3" fill="currentColor">
                    <animate
                      attributeName="opacity"
                      values="1;0.2;1"
                      dur="1.2s"
                      begin="0.30000000000000004s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              )}

            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SecurityForm;
